import React from 'react';
import { getSmoothStepPath } from 'reactflow';

// CustomElbowEdge component
const CustomElbowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // For a 'TB' (top-to-bottom) layout, sourcePosition is 'bottom' and targetPosition is 'top'.
  // The elbow will go down from the source, then horizontally, then down to the target.

  // Path with a single elbow point
  // The elbow point will be vertically halfway between source and target if sourceY < targetY
  // and horizontally aligned with the target.
  // Or, it could be simpler: go down a bit, then horizontal, then to target.

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0, // Make it a sharp elbow
    // You can adjust these offsets to control the elbow shape
    // offsetX: (targetX - sourceX) / 2, 
    // offsetY: (targetY - sourceY) / 2,
  });
  
  // A more explicit elbow path calculation:
  // 1. Move vertically from source
  // 2. Move horizontally to align with target X
  // 3. Move vertically to target Y
  // This is a common pattern for "TB" (Top-Bottom) or "BT" (Bottom-Top) layouts
  
  let path;
  const yDifference = targetY - sourceY;
  const xDifference = targetX - sourceX;

  // A simple elbow: move down/up halfway, then across, then down/up to target.
  const midY = sourceY + yDifference / 2;

  if (sourcePosition === 'bottom' && targetPosition === 'top') {
    // Typical for TB layout
    path = `M ${sourceX},${sourceY} L ${sourceX},${midY} L ${targetX},${midY} L ${targetX},${targetY}`;
  } else if (sourcePosition === 'top' && targetPosition === 'bottom') {
    // Typical for BT layout
    path = `M ${sourceX},${sourceY} L ${sourceX},${midY} L ${targetX},${midY} L ${targetX},${targetY}`;
  } else if (sourcePosition === 'right' && targetPosition === 'left') {
    // Typical for LR layout
    const midX = sourceX + xDifference / 2;
    path = `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`;
  } else if (sourcePosition === 'left' && targetPosition === 'right') {
    // Typical for RL layout
    const midX = sourceX + xDifference / 2;
    path = `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`;
  } else {
    // Fallback to a smooth step path if positions are not standard for elbow
    path = edgePath;
  }


  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={path}
      markerEnd={markerEnd}
    />
  );
};

export default CustomElbowEdge;
