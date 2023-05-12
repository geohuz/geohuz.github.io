import { useNode, useEditor } from '@craftjs/core';
import { NodeFrame, NodeFrameSettings, NodeFrameDefaultProps } from './NodeFrame'
import { css } from '@emotion/react';

export const Container = ({children}) => {
  const { direction, connectors: { connect, drag }, id: containerNodeId, name} 
    = useNode(node=> ({direction: node.data.custom.direction, name: node.data.custom.displayName}))

  const { isBeingDraggedOver } = useEditor((state, query) => {
    // we have to look through all the ancestors (and the element itself) the user currently drags over
    let isBeingDraggedOver = false;

    for (const nodeId of query.getDraggedOverNodes()) {
      // we are looking for the first canvas element
      if (query.node(nodeId).isCanvas()) {
        // if the id of first canvas element is the same as this Container's id we know that the user is dragging over this Container
        if (nodeId === containerNodeId) {
          isBeingDraggedOver = true;
        }
        // Since we are only interested in the first Canvas, we break out of the loop
        break;
      }
    }

    return {
      isBeingDraggedOver,
    };
  });
 
  return (
    <div
      ref={dom => connect(drag(dom))}
      className={isBeingDraggedOver ? "droparea" : ""}
      datatooltip={name}
      css={css`
        padding: 5px;
        display: flex;
        flex-flow: ${direction} wrap;
        align-items: center;
        /* margin-bottom: auto; */
        justify-content: space-between;
        outline: ${isBeingDraggedOver ? '2px dashed blue' : undefined}; 
      `}
    >
      {children}
    </div>
  );
};

Container.craft = {
  display: "Container",
  rules: {
    // canMoveIn: (incomingNodes, self, helper) => {
    //   // incomingNodes.every(node=>{
    //   //   return (node.data.custom.direction===helper(self.id).get().data.custom.direction)
    //   // })
    // }
  },
  custom: {
    direction: 'row',
  }
}

/*
        outline: ${isBeingDraggedOver ? '2px dashed blue' : undefined}; 
*/
