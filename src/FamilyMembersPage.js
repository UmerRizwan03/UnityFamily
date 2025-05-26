// pages/FamilyMembersPage.js

import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import { formatTreeData } from './FormatTreeData';
import { getLayoutedElements } from './GetLayoutedElements';

const nodeTypes = { custom: CustomNode };

const FamilyMembersPage = ({ members, relationships }) => {
  const { nodes: rawNodes, edges: rawEdges } = formatTreeData(members, relationships);
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    const { nodes: updatedNodes, edges: updatedEdges } = getLayoutedElements(
      formatTreeData(members, relationships).nodes,
      formatTreeData(members, relationships).edges
    );
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [members, relationships]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FamilyMembersPage;
