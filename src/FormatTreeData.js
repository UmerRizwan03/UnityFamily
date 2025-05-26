// utils/FormatTreeData.js

export function formatTreeData(membersArray, relationshipsArray) {
    const nodes = [];
    const edges = [];
    const jointNodes = new Map();
    const memberIdToNode = new Map();
  
    membersArray.forEach(member => {
      const node = {
        id: member.id.toString(),
        type: 'custom',
        data: { memberData: member, isJoint: false },
        position: { x: 0, y: 0 },
      };
      nodes.push(node);
      memberIdToNode.set(node.id, node);
    });
  
    relationshipsArray.forEach(rel => {
      if (rel.relationship_type === 'partner') {
        const [id1, id2] = [rel.member1_id.toString(), rel.member2_id.toString()].sort();
        const jointId = `joint-${id1}-${id2}`;
  
        if (!jointNodes.has(jointId)) {
          nodes.push({
            id: jointId,
            type: 'custom',
            data: { isJoint: true },
            position: { x: 0, y: 0 },
          });
          jointNodes.set(jointId, { id1, id2 });
        }
  
        edges.push({
          id: `e-${id1}-joint`,
          source: id1,
          target: jointId,
          sourceHandle: 'right-source',
          targetHandle: 'left-joint',
          type: 'step',
        });
  
        edges.push({
          id: `e-${id2}-joint`,
          source: id2,
          target: jointId,
          sourceHandle: 'left-source',
          targetHandle: 'right-joint',
          type: 'step',
        });
      }
    });
  
    relationshipsArray.forEach(rel => {
      if (rel.relationship_type === 'parent-child') {
        const parentId = rel.member1_id.toString();
        const childId = rel.member2_id.toString();
  
        let foundJoint = null;
        for (const [jointId, partners] of jointNodes) {
          if (partners.id1 === parentId || partners.id2 === parentId) {
            foundJoint = jointId;
            break;
          }
        }
  
        if (foundJoint) {
          edges.push({
            id: `e-${foundJoint}-${childId}`,
            source: foundJoint,
            target: childId,
            sourceHandle: 'bottom-joint',
            targetHandle: 'top',
            type: 'step',
            label: 'Parent-Child',
          });
        } else {
          edges.push({
            id: `e-${parentId}-${childId}`,
            source: parentId,
            target: childId,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'step',
            label: 'Parent-Child',
          });
        }
      }
    });
  
    return { nodes, edges };
  }
  