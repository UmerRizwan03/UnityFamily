// utils/GetLayoutedElements.js
import dagre from 'dagre';

const nodeWidth = 256;
const nodeHeight = 140;
const unionNodeWidth = 50; // Smaller width for union nodes
const unionNodeHeight = 50; // Smaller height for union nodes
const spouseSpacing = 50; 
const nodesep = 150; // Adjusted from 100
const ranksep = 250; // Adjusted from 200

export function getLayoutedElements(initialNodes, initialEdges, relationships, direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep, ranksep });

  let updatedNodes = [...initialNodes]; // Nodes from FormatTreeData.js (members + unions)
  // initialEdges are from FormatTreeData.js (partner-union, union-child, singleparent-child)
  
  // New Virtual Node Logic
  // updatedRelationships will store new virtual links for Dagre and visualization.
  // The original 'relationships' prop is kept for semantic data if needed elsewhere.
  const virtualLinkRelationships = []; 
  let virtualNodeCounter = 1;

  // 1. Identify children connected to multiple sources (unions or single parents)
  const childToSourceNodesMap = new Map();
  initialEdges.forEach(edge => {
    const targetNode = initialNodes.find(n => n.id === edge.target);
    // Consider edges pointing to actual member nodes (not unions/virtuals created here)
    // and where the source is a union or a member node (potential parent).
    if (targetNode && !targetNode.data.isUnion && !targetNode.data.isVirtual) {
        // Ensure source is a parental unit (union or member node not acting as child in another edge)
        const sourceNode = initialNodes.find(n => n.id === edge.source);
        if (sourceNode && (sourceNode.data.isUnion || !initialEdges.some(e => e.target === sourceNode.id))) {
            if (!childToSourceNodesMap.has(edge.target)) {
                childToSourceNodesMap.set(edge.target, new Set());
            }
            childToSourceNodesMap.get(edge.target).add(edge.source);
        }
    }
  });

  // 2. For children with multiple sources, create virtual nodes
  const childrenWithVirtualNodes = new Set(); // To track which children get a virtual node
  childToSourceNodesMap.forEach((sourceNodes, childId) => {
    if (sourceNodes.size > 1) {
      const virtualId = `virtual-${virtualNodeCounter++}`;
      updatedNodes.push({ 
        id: virtualId, 
        type: 'custom', 
        data: { isVirtual: true, label: 'Family Link' }, 
        position: { x: 0, y: 0 } 
      });
      childrenWithVirtualNodes.add(childId);

      sourceNodes.forEach(sourceNodeId => {
        virtualLinkRelationships.push({
          parentUnit: sourceNodeId, // Actual source: union or single parent
          virtualNode: virtualId,
          type: 'source_to_virtual'
        });
      });
      virtualLinkRelationships.push({
        virtualNode: virtualId,
        child: childId,
        type: 'virtual_to_child'
      });
    }
  });
  
  updatedNodes.forEach((node) => {
    const width = node.data?.isUnion || node.id.startsWith('union-') ? unionNodeWidth : node.data?.isVirtual ? unionNodeWidth : nodeWidth;
    const height = node.data?.isUnion || node.id.startsWith('union-') ? unionNodeHeight : node.data?.isVirtual ? unionNodeHeight : nodeHeight;
    dagreGraph.setNode(node.id, { width, height });
  });

  // Use initialEdges (from FormatTreeData.js) for Dagre layout,
  // but filter out direct child connections if child now uses a virtual node.
  initialEdges.forEach(edge => {
    if (childrenWithVirtualNodes.has(edge.target) && childToSourceNodesMap.get(edge.target)?.has(edge.source) ) {
      // This edge is a direct link to a child who now has a virtual node,
      // and this edge's source is one of the parental units for that virtual node.
      // So, this direct edge should not be added to Dagre for layout.
      // The path will be: source -> virtual_node -> child.
      return; 
    }
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  // Add edges related to virtual nodes to Dagre
  virtualLinkRelationships.forEach(vRel => {
    if (vRel.type === 'source_to_virtual') {
        dagreGraph.setEdge(vRel.parentUnit, vRel.virtualNode);
    } else if (vRel.type === 'virtual_to_child') {
        dagreGraph.setEdge(vRel.virtualNode, vRel.child);
    }
  });

  dagre.layout(dagreGraph);

  const positionedNodes = updatedNodes.map(node => {
    const dagreNode = dagreGraph.node(node.id);
    if (!dagreNode) return node; 
    const width = node.data?.isUnion || node.id.startsWith('union-') ? unionNodeWidth : node.data?.isVirtual ? unionNodeWidth : nodeWidth;
    const height = node.data?.isUnion || node.id.startsWith('union-') ? unionNodeHeight : node.data?.isVirtual ? unionNodeHeight : nodeHeight;
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: dagreNode.x - width / 2,
        y: dagreNode.y - height / 2,
      },
    };
  });
  
  const adjustedNodes = [...positionedNodes];
  
  // New Spouse Adjustment Logic
  const unionNodesFromInitial = initialNodes.filter(n => n.data?.isUnion);

  unionNodesFromInitial.forEach(unionNode => {
    const unionNodeId = unionNode.id;
    const dagreUnionNode = dagreGraph.node(unionNodeId); // Get Dagre's position for the union node

    if (!dagreUnionNode) return;

    // Find partners connected to this union node from initialEdges
    const partnerEdges = initialEdges.filter(edge => edge.target === unionNodeId);
    const partnerIds = partnerEdges.map(edge => edge.source);
    
    if (partnerIds.length === 2) {
      const partner1Id = partnerIds[0];
      const partner2Id = partnerIds[1];

      const partner1NodeIndex = adjustedNodes.findIndex(n => n.id === partner1Id);
      const partner2NodeIndex = adjustedNodes.findIndex(n => n.id === partner2Id);

      if (partner1NodeIndex !== -1 && partner2NodeIndex !== -1) {
        const partner1 = adjustedNodes[partner1NodeIndex];
        const partner2 = adjustedNodes[partner2NodeIndex];

        // Ensure partners are on the same Y-level.
        // Dagre should place partners feeding into a union node at the same rank (Y-level) naturally with TB direction.
        // We will primarily adjust their X positions to be symmetrical around the union node.
        // Let's assume Dagre has placed the union node and partners at reasonable Y levels.
        // The main task is horizontal alignment.
        const commonY = partner1.position.y; // Assume Dagre placed them at the same Y, or pick one.
                                            // Or, could use dagreUnionNode.y - some_offset if partners are above.
                                            // For now, let's assume they are at the same Y as computed by Dagre.
        
        adjustedNodes[partner1NodeIndex].position.y = commonY;
        adjustedNodes[partner2NodeIndex].position.y = commonY;

        // Adjust X positions to be symmetrical around the union node's X coordinate.
        // The union node itself is small (unionNodeWidth). Partners are larger (nodeWidth).
        const spaceBetweenPartners = spouseSpacing;
        const halfTotalPartnerWidth = nodeWidth + spaceBetweenPartners / 2;
        
        // Position partner1 to the left of unionNode's center, partner2 to the right.
        // To make them symmetrical around dagreUnionNode.x:
        let p1x = dagreUnionNode.x - unionNodeWidth/2 - spaceBetweenPartners - nodeWidth/2 ;
        let p2x = dagreUnionNode.x + unionNodeWidth/2 + spaceBetweenPartners + nodeWidth/2;

        // A simpler symmetric positioning:
        p1x = dagreUnionNode.x - nodeWidth/2 - spouseSpacing/2;
        p2x = dagreUnionNode.x + nodeWidth/2 + spouseSpacing/2;


        // If partner1Id is numerically/alphabetically smaller, place it left.
        if (partner1Id.localeCompare(partner2Id) < 0) {
          adjustedNodes[partner1NodeIndex].position.x = p1x;
          adjustedNodes[partner2NodeIndex].position.x = p2x;
        } else {
          adjustedNodes[partner1NodeIndex].position.x = p2x;
          adjustedNodes[partner2NodeIndex].position.x = p1x;
        }
      }
    }
  });

  // The visual edges are now `initialEdges` as prepared by FormatTreeData.js,
  // plus any edges related to virtual nodes if they are to be visualized.
  // For now, let's return initialEdges, assuming virtual node connections are layout-only.
  // If virtual_parent_link and virtual_child_link need to be visible, they'd need conversion to React Flow edge format.
  
  let finalEdges = [...initialEdges]; 
  
  // Add visual edges for virtual connections if they were created and influenced Dagre layout
  const virtualLinkStyle = { stroke: '#ccc', strokeDasharray: '2,2', strokeWidth: 1.5 };
  virtualLinkRelationships.forEach(vRel => {
    if (vRel.type === 'source_to_virtual') {
      finalEdges.push({
        id: `ve-${vRel.parentUnit}-${vRel.virtualNode}`, 
        source: vRel.parentUnit, 
        target: vRel.virtualNode, 
        type: 'smoothstep', 
        style: virtualLinkStyle,
      });
    } else if (vRel.type === 'virtual_to_child') {
      finalEdges.push({
        id: `ve-${vRel.virtualNode}-${vRel.child}`, 
        source: vRel.virtualNode, 
        target: vRel.child, 
        type: 'customElbow', // Match parent-child style
        style: virtualLinkStyle,
      });
    }
  });
  // Remove duplicate edges by ID, just in case initialEdges already contained some form of these.
  finalEdges = Array.from(new Map(finalEdges.map(edge => [edge.id, edge])).values());


  const finalNodesIds = new Set(adjustedNodes.map(n => n.id));
  const filteredEdges = finalEdges.filter(edge => finalNodesIds.has(edge.source) && finalNodesIds.has(edge.target));

  return { nodes: adjustedNodes, edges: filteredEdges };
}
