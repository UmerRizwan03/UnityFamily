import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  const { memberData, isJoint, label } = data; // Destructure isJoint and label

  // If it's a joint node (now representing a "union" node), render an invisible style
  if (isJoint) { // data.isJoint is true for union nodes
    return (
      // This div is made nearly invisible but still serves as an anchor for handles.
      // Position relative is important for the absolute positioning of handles.
      <div style={{ width: '1px', height: '1px', opacity: 0, position: 'relative' }}>
        {/* Handles for joint/union node. Their styles position them around this tiny div. */}
        <Handle type="target" position={Position.Top} id="top-joint" style={{ top: -5 }} isConnectable={true} />
        <Handle type="source" position={Position.Bottom} id="bottom-joint" style={{ bottom: -5 }} isConnectable={true} />
        <Handle type="target" position={Position.Left} id="left-joint" style={{ left: -5 }} isConnectable={true} />
        <Handle type="target" position={Position.Right} id="right-joint" style={{ right: -5 }} isConnectable={true} /> 
        {/* The visible label is removed. */}
      </div>
    );
  }

  // Existing rendering for individual member nodes
  return (
    <div className="custom-node bg-neutral-700 text-neutral-200 rounded-lg shadow-md p-4 border border-neutral-600 w-64 h-36 flex flex-col items-center justify-center relative">
      {/* Top handle for incoming parent-child edges */}
      <Handle type="target" position={Position.Top} id="top" isConnectable={true} />

      {/* Left handles for partner edges */}
      <Handle type="target" position={Position.Left} id="left-target" style={{ left: -5 }} isConnectable={true} />
      <Handle type="source" position={Position.Left} id="left-source" style={{ left: -5 }} isConnectable={true} />

      {/* Right handles for partner edges */}
      <Handle type="target" position={Position.Right} id="right-target" style={{ right: -5 }} isConnectable={true} />
      <Handle type="source" position={Position.Right} id="right-source" style={{ right: -5 }} isConnectable={true} />

      {/* Bottom handle for outgoing parent-child edges */}
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={true} />

      {memberData ? (
        <>
          <img
            src={memberData.image_url || '/placeholder.png'} // Use placeholder if no image
            alt={memberData.name || 'Unknown'}
            className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-accent-primary"
          />
          <div className="text-sm font-semibold text-center">{memberData.name}</div>
          {/* Optional: Display birth date or other info */}
          {/* {memberData.birth_date && <div className="text-xs text-neutral-400">Born: {memberData.birth_date}</div>} */}
        </>
      ) : (
        // Fallback if memberData is somehow not provided for a non-joint node (should not happen with correct data prep)
        <div className="text-sm font-semibold text-center">Invalid Data</div>
      )}
    </div>
  );
};

export default CustomNode;
