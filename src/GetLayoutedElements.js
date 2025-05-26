// utils/GetLayoutedElements.js

import dagre from 'dagre';

const nodeWidth = 256;
const nodeHeight = 140;
const nodesep = 100;
const ranksep = 200;

export function getLayoutedElements(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph();
  const isHorizontal = direction === 'LR';

  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep, ranksep });

  // Add all nodes
  nodes.forEach(node => {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add all edges normally (no source/target swap)
  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map(node => {
    const dagreNode = g.node(node.id);
    if (!dagreNode) return node;

    const isJoint = node.data?.isJoint;
    let adjustedX = dagreNode.x - nodeWidth / 2;
    let adjustedY = dagreNode.y - nodeHeight / 2;

    // Try to space out partners near a joint
    if (!isJoint && node.id.startsWith('joint-') === false) {
      const jointEdge = edges.find(e => e.target === node.id && e.source.startsWith('joint-'));
      if (jointEdge) {
        const sibling = nodes.find(n =>
          n.id !== node.id &&
          edges.some(e => e.target === n.id && e.source === jointEdge.source)
        );
        if (sibling) {
          const siblingNode = g.node(sibling.id);
          if (siblingNode) {
            const midX = (dagreNode.x + siblingNode.x) / 2;
            adjustedX = node.id < sibling.id ? midX - 120 : midX + 120;
          }
        }
      }
    }

    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: adjustedX,
        y: adjustedY,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
