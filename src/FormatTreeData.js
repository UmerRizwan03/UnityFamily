// utils/FormatTreeData.js

export function formatTreeData(membersArray, relationshipsArray) {
  const nodes = [];
  const edges = [];
  const memberIdToNode = new Map();
  const unionNodes = new Map(); // Stores union nodes: key is sorted partner ids, value is union node id

  // 1. Create all member nodes
  membersArray.forEach(member => {
    const nodeId = member.id.toString();
    const node = {
      id: nodeId,
      type: 'custom', // Will be rendered by CustomNode
      data: { memberData: member, isUnion: false, label: member.name },
      position: { x: 0, y: 0 }, // Positioned by Dagre in GetLayoutedElements
    };
    nodes.push(node);
    memberIdToNode.set(nodeId, node);
  });

  // 2. Create union nodes for each partnership and connect partners to it
  relationshipsArray.forEach(rel => {
    if (rel.relationship_type === 'partner') {
      const m1Id = rel.member1_id.toString();
      const m2Id = rel.member2_id.toString();
      const sortedPartnerIds = [m1Id, m2Id].sort();
      const unionNodeKey = sortedPartnerIds.join('-');
      let unionNodeId;

      if (!unionNodes.has(unionNodeKey)) {
        unionNodeId = `union-${unionNodeKey}`;
        nodes.push({
          id: unionNodeId,
          type: 'custom', 
          data: { isUnion: true, isJoint: true, label: '⚭' }, // isJoint for CustomNode style
          position: { x: 0, y: 0 },
        });
        unionNodes.set(unionNodeKey, unionNodeId);
      } else {
        unionNodeId = unionNodes.get(unionNodeKey);
      }

      // Edge from member1 (assuming m1Id is left partner visually) to union node
      edges.push({
        id: `e-${m1Id}-${unionNodeId}`,
        source: m1Id,
        target: unionNodeId,
        type: 'smoothstep', 
        sourceHandle: 'right-source', // From CustomNode: member node's right side
        targetHandle: 'left-joint',  // From CustomNode: union node's left side
        style: { stroke: '#aaa' },
      });

      // Edge from member2 (assuming m2Id is right partner visually) to union node
      edges.push({
        id: `e-${m2Id}-${unionNodeId}`,
        source: m2Id,
        target: unionNodeId,
        type: 'smoothstep',
        sourceHandle: 'left-source',  // From CustomNode: member node's left side
        targetHandle: 'right-joint', // From CustomNode: union node's right side
        style: { stroke: '#aaa' },
      });
    }
  });

  // 3. Connect children to appropriate union node or directly to single parent
  relationshipsArray.forEach(rel => {
    if (rel.relationship_type === 'parent-child') {
      const childId = rel.member1_id.toString(); 
      const parentId = rel.member2_id.toString(); 

      let unionFoundForThisChildParentPair = false;
      
      // Find other parents of the same child from relationshipsArray
      const allParentsOfChild = relationshipsArray
        .filter(r => r.relationship_type === 'parent-child' && r.member1_id.toString() === childId)
        .map(r => r.member2_id.toString());

      // Check if this parent (parentId) is partnered with any of the other parents of this child
      for (const otherParentId of allParentsOfChild) {
        if (parentId === otherParentId) continue; // Don't check against self

        const sortedPartnerIds = [parentId, otherParentId].sort();
        const potentialUnionKey = sortedPartnerIds.join('-');
        
        if (unionNodes.has(potentialUnionKey)) {
          const unionNodeId = unionNodes.get(potentialUnionKey);
          // Check if an edge from this union to this child already exists
          const edgeAlreadyExists = edges.some(e => e.source === unionNodeId && e.target === childId);
          if (!edgeAlreadyExists) {
            edges.push({
              id: `e-${unionNodeId}-${childId}`,
              source: unionNodeId,
              target: childId,
              type: 'customElbow', 
              sourceHandle: 'bottom-joint', // From CustomNode: union node's bottom
              targetHandle: 'top',         // From CustomNode: child node's top
              style: { stroke: '#888', strokeWidth: 2 },
            });
          }
          unionFoundForThisChildParentPair = true;
          break; // Found the union for this child with this parent and a co-parent
        }
      }

      if (!unionFoundForThisChildParentPair) {
        // This parent (parentId) is either a single parent to this child,
        // or their partner (if any) is not a co-parent of this specific child.
        // Connect child directly to this parent, but only if no other connection (e.g. from a union) has already been made to this child.
        const existingEdgeToChild = edges.find(e => e.target === childId);
        if (!existingEdgeToChild) {
          edges.push({
            id: `e-${parentId}-${childId}`,
            source: parentId,
            target: childId,
            type: 'customElbow',
            sourceHandle: 'bottom', // From CustomNode: member node's bottom
            targetHandle: 'top',    // From CustomNode: child node's top
            style: { stroke: '#888', strokeWidth: 2 },
            // label: 'parent-child (direct)' // Optional label
          });
        }
      }
    }
  });
  
  // Ensure all nodes are unique (should be due to Map usage for unions)
  const uniqueNodes = Array.from(new Map(nodes.map(node => [node.id, node])).values());
  // Ensure all edges are unique by ID
  const uniqueEdges = Array.from(new Map(edges.map(edge => [edge.id, edge])).values());


  return { nodes: uniqueNodes, edges: uniqueEdges };
}
