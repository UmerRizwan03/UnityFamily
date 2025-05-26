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
import { getLayoutedElements } from './GetLayoutedElements'; // Updated import
import CustomElbowEdge from './CustomElbowEdge'; // Import for edge type

const nodeTypes = { custom: CustomNode };
const edgeTypes = { customElbow: CustomElbowEdge }; // Define edgeTypes

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
      edgeTypes={edgeTypes} // Pass edgeTypes to ReactFlow
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

// Added relationships prop
const FamilyTreeChart = ({ initialNodes, initialEdges, relationships }) => {
  // Use useMemo to calculate layout only when inputs change
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    // Provide default empty arrays if props are undefined
    const currentNodes = initialNodes || [];
    const currentRelationships = relationships || [];
    // initialEdges might not be directly used by getLayoutedElements for dagre graph if relationships are primary source
    // but it's kept for now as per function signature. The new getLayoutedElements primarily uses relationships.
    return getLayoutedElements(currentNodes, initialEdges || [], currentRelationships, 'TB');
  }, [initialNodes, initialEdges, relationships]);

  const [nodes, setNodes] = useState(layoutedNodes);
  const [edges, setEdges] = useState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes] // Added setNodes to dependency array
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges] // Added setEdges to dependency array
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
