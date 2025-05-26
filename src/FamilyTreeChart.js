// components/FamilyTreeChart.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

const AnimatedReactFlow = ({ nodes, edges, onNodesChange, onEdgesChange }) => (
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

const FamilyTreeChart = ({ initialNodes, initialEdges }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

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
        />
      </ReactFlowProvider>
    </div>
  );
};

export default FamilyTreeChart;
