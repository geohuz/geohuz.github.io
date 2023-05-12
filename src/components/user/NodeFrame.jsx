import { useNode, useEditor } from '@craftjs/core';
import { Slider } from '@mui/material';
import { Paper, FormControl, FormLabel } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import React from 'react';
import { css } from '@emotion/react'

export const NodeFrame = ({ background, padding, children, ...props }) => {
  const {
    id: containerNodeId,
    name,
    connectors: { connect },
  } = useNode(node=> ({name: node.data.custom.displayName}));

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
    <Paper
      {...props}
      ref={ dom => connect(dom)}
      datatooltip={name}
      className={isBeingDraggedOver ? "droparea" : ""}
      css={css` 
        /* display: inline-block; */
        /* width: fit-content; */
        display: inline-block;
        min-width: 100px;
        min-height: 100px;
        max-width: 800px;
        max-height: 800px;
        margin: 4px 0;
        background: ${background};
        padding: ${padding}px;
        outline: ${isBeingDraggedOver ? '2px dashed blue' : undefined};
      `}
    >
      {children}
    </Paper>
  );
};

export const NodeFrameSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <MuiColorInput
          name="background-color"
          value={background}
          onChange={(color) => {
            setProp((props) => (props.background = color), 500);
          }}
        />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Padding</FormLabel>
        <Slider
          defaultValue={padding}
          onChange={(_, value) =>
            setProp((props) => (props.padding = value), 500)
          }
        />
      </FormControl>
    </div>
  );
};

export const NodeFrameDefaultProps = {
  background: '#ffffff',
  padding: 5,
};

NodeFrame.craft = {
  rules: {
    canMoveIn: (incomingNodes) => 
      incomingNodes.every(node=> (node.data.name!=="Text" && node.data.name!=="ImageBox"))
  },
  props: NodeFrameDefaultProps,
  related: {
    settings: NodeFrameSettings,
  },
  custom: {
    displayName: "canvas"
  }
};
