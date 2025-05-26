import React, { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { motion } from 'framer-motion';

import CustomNode from './CustomNode';
import CustomElbowEdge from './CustomElbowEdge';

const nodeWidth = 256;
const nodeHeight = 140;
const spouseSpacing = 50;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, relationships, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 200 });

  let updatedNodes = [...nodes];
  let updatedRelationships = [...relationships];

  const parentPairs = new Map();
  relationships.filter(r => r.relationship_type === 'parent-child').forEach(({ member1_id, member2_id }) => {
    const childId = member1_id.toString();
    const parentId = member2_id.toString();

    if (!parentPairs.has(childId)) parentPairs.set(childId, []);
    parentPairs.get(childId).push(parentId);
  });

  let virtualNodeCounter = 1;
  parentPairs.forEach((parents, childId) => {
    if (parents.length > 1) {
      const sortedParents = [...parents].sort();
      const virtualId = `virtual-${virtualNodeCounter++}`;
      updatedNodes.push({ id: virtualId, type: 'custom', data: { isVirtual: true }, position: { x: 0, y: 0 } });

      sortedParents.forEach(pid => {
        updatedRelationships.push({ member1_id: pid, member2_id: virtualId, relationship_type: 'virtual' });
      });

      updatedRelationships = updatedRelationships.map(rel => {
        if (rel.relationship_type === 'parent-child' && rel.member1_id.toString() === childId) {
          return { ...rel, member2_id: virtualId };
        }
        return rel;
      });
    }
  });

  updatedNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  updatedRelationships.forEach(rel => {
    if (rel.relationship_type === 'parent-child' || rel.relationship_type === 'virtual') {
      dagreGraph.setEdge(rel.member2_id.toString(), rel.member1_id.toString());
    }
  });

  dagre.layout(dagreGraph);

  const positionedNodes = updatedNodes.map(node => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    };
  });

  const adjustedNodes = [...positionedNodes];
  const visited = new Set();
  const partnerMap = new Map();

  updatedRelationships.filter(r => r.relationship_type === 'partner').forEach(({ member1_id, member2_id }) => {
    const m1 = member1_id.toString();
    const m2 = member2_id.toString();
    if (!partnerMap.has(m1)) partnerMap.set(m1, []);
    if (!partnerMap.has(m2)) partnerMap.set(m2, []);
    partnerMap.get(m1).push(m2);
    partnerMap.get(m2).push(m1);
  });

  adjustedNodes.forEach((node) => {
    if (visited.has(node.id) || node.data?.isVirtual) return;

    const partners = partnerMap.get(node.id) || [];
    const group = [node, ...partners.map(id => adjustedNodes.find(n => n.id === id)).filter(Boolean)];
    const uniqueGroup = [...new Set(group.map(n => n?.id))].map(id => adjustedNodes.find(n => n.id === id));

    if (uniqueGroup.length <= 1) return;
    uniqueGroup.forEach(n => visited.add(n.id));

    let centerNode = uniqueGroup.find(n => n.data?.gender === 'male')
                  || uniqueGroup.find(n => n.data?.gender === 'female')
                  || node;

    const baseY = centerNode.position.y;
    const centerX = centerNode.position.x;

    const partnersOnly = uniqueGroup.filter(n => n.id !== centerNode.id).sort((a, b) => a.id.localeCompare(b.id));

    const centerIdx = adjustedNodes.findIndex(n => n.id === centerNode.id);
    adjustedNodes[centerIdx].position = { x: centerX, y: baseY };

    const totalWidth = partnersOnly.length * (nodeWidth + spouseSpacing);
    let startX = centerX - totalWidth / 2;
    partnersOnly.forEach((partner) => {
      const idx = adjustedNodes.findIndex(n => n.id === partner.id);
      adjustedNodes[idx].position = {
        x: startX,
        y: baseY,
      };
      startX += nodeWidth + spouseSpacing;
    });
  });

  const visualEdges = updatedRelationships.map(rel => {
    const { member1_id, member2_id, relationship_type } = rel;
    const edgeId = `${member1_id}-${member2_id}-${relationship_type}`;
    return {
      id: edgeId,
      source: member2_id.toString(),
      target: member1_id.toString(),
      type: relationship_type === 'parent-child' ? 'customElbow' : 'smoothstep',
      animated: relationship_type === 'partner',
      style: {
        stroke: relationship_type === 'partner' ? '#ff69b4' : relationship_type === 'virtual' ? '#ccc' : '#888',
        strokeWidth: 2,
        strokeDasharray: relationship_type === 'partner' ? '6,4' : relationship_type === 'virtual' ? '2,2' : '0',
      },
      sourceHandle: '',  // << Fix added here
      targetHandle: '',  // << Fix added here
    };
  });

  return { nodes: adjustedNodes, edges: visualEdges };
};

const AnimatedReactFlow = ({ nodes, edges, onNodesChange, onEdgesChange, nodeTypes }) => {
  const edgeTypes = useMemo(() => ({ customElbow: CustomElbowEdge }), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ height: '100%' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="family-tree-flow"
        connectionLineStyle={{ stroke: 'var(--color-accent-primary)' }}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={18} size={0.75} color="#333" />
      </ReactFlow>
    </motion.div>
  );
};

const FamilyTreeChart = ({ initialNodes, initialEdges, relationships }) => {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges, relationships, 'TB'),
    [initialNodes, initialEdges, relationships]
  );

  const [nodes, setNodes] = useState(layoutedNodes);
  const [edges, setEdges] = useState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ height: '90vh', width: '100%' }} className="bg-transparent">
      <ReactFlowProvider>
        <AnimatedReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default FamilyTreeChart;
