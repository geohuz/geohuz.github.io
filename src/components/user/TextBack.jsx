import { createEditor, Node, Editor ,Transforms } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { useNode, useEditor } from '@craftjs/core';
import { Slider, FormControl, FormLabel } from '@mui/material';
import React, { useState, useLayoutEffect, useEffect, useRef, useContext, useCallback } from 'react';
import { Resizer } from '../Resizer'
import useResizeObserver from 'use-resize-observer'
import {appStore} from '../../appStore'
import {Observer} from 'mobx-react-lite'
import {css} from '@emotion/react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import RichEditor from '../RichEditor'


const textAreaMargin = '5'

const defaultProps = {
  // display: 'block',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  padding: ['0', '0', '0', '0'],
  margin: [textAreaMargin, textAreaMargin, textAreaMargin, textAreaMargin],
//  background: { r: 255, g: 255, b: 255, a: 1 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  shadow: 0,
  radius: 0,
  width: 'auto',
  height: 'auto',
};

// serialize and deserialize user input: https://docs.slatejs.org/walkthroughs/06-saving-to-a-database
const serialize = value => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map(n => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

const deserialize = string => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map(line => {
    return {
      children: [{ text: line }],
    }
  })
}

export const Text = ({ text, fontSize, textAlign, ...props }) => {
  const refEditable = React.useRef(null);
  const refResizer = React.useRef(null);
  useResizeObserver(
    {
     ref: refResizer,
     onResize: ({height}) => {
        appStore.setTextAreaParentHeight(height)
     }
  })
  useResizeObserver(
    {
     ref: refEditable,
     onResize: ({height}) => {
        if (height - appStore.textAreaParentHeight > 0)  {
          appStore.setTextAreaOverflow(true)
        } else {
          appStore.setTextAreaOverflow(false)
        }
     },
    }
  )

  const {
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    // background,
    color,
    padding,
    margin,
    shadow,
    radius,
  } = props


  const {
    id: id,
    data,
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode(node => {
    return {
      selected: node.events.selected,
      data: node.data
    }
  });

  const [slateEditor] = useState(()=>withReact(createEditor()))

  const { actions, query  } = useEditor()
  const _text = useRef(text)

  // auto text prompt 
  let dirDict = {"row": "行", "column": "列"}
  let childNodes_l = query.node(data.parent).childNodes().length
  let blockDirection = query.node(data.parent).get().data.custom.direction
  if (_text.current === '文本') {
    _text.current = `${dirDict[blockDirection]}${_text.current}`
  }
  
  if (childNodes_l>1 && _text.current.includes('容器')) {
    _text.current = `${dirDict[blockDirection]}文本`
  }

  const initialValue = deserialize(_text.current)
  const [editorEditable, setEditorEditable] = useState(false);

  useEffect(() => {
    if (selected) {
      return;
    }

    setEditorEditable(false);
  }, [selected]);

  return (
    <div 
      // ref={refResizer}
    >
    <Resizer
      propKey={{ width: 'width', height: 'height' }}
      style={{
        display: "inline-box",
        justifyContent,
        flexDirection,
        alignItems,
        // background: `rgba(${Object.values(background)})`,
        color: `rgba(${Object.values(color)})`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        boxShadow:
          shadow === 0
            ? 'none'
            : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
        borderRadius: `${radius}px`,
        flex: fillSpace === 'yes' ? 1 : 'unset',
      }}
    >
    <Observer>
      {()=>
      <div
        // ref={dom=>connect(drag(dom))}
        onClick={()=>selected && setEditorEditable(true)}
        // style={{
        //   width: "100%", 
        //   height: '100%',
        //   overflow: "hidden",
        //  }}
        css={css`
          width: 100%;
          height: 100%;
          overflow: hidden;
        `}
      >
        <Slate 
          editor={slateEditor} 
          value={initialValue}
          onChange={value => {
            let text = serialize(value)
            setProp(props=>(props.text = text), 500)
            _text.current = text 
          }}
        >
          <div
            // ref={refEditable}
          >
          <Editable 
            style={{
              fontSize: `${fontSize}px`, 
              // margin: `${textAreaMargin}px`, 
              textAlign 
            }}
            readOnly={!editorEditable}
            // onFocus={e => window.getSelection()?.selectAllChildren(e.currentTarget)}
            onBlur={() => {
              if (_text.current==="") {
                actions.delete(id)
              }
              Transforms.select(slateEditor, {
                anchor: Editor.start(slateEditor,[]),
                focus: Editor.start(slateEditor, [])
              })
              return true
            }}
          />
          </div>
        </Slate>
        <PopupEditor open={appStore.richTextMode===true} initialValue={initialValue}/>
      </div>
      }
      </Observer>
      </Resizer>
      </div>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
  }));

  return (
    <>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Font size</FormLabel>
        <Slider
          value={fontSize || 7}
          step={7}
          min={1}
          max={50}
          onChange={(_, value) => {
            setProp((props) => (props.fontSize = value), 1000);
          }}
        />
      </FormControl>
    </>
  );
};

function PopupEditor({open, initialValue}) {

  const handleClose = () => {
    appStore.setRichTextMode(false)
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
        >
          <RichEditor initialValue={initialValue}/>

        </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export const TextDefaultProps = {
  text: 'Hi',
  fontSize: 12,
};

Text.craft = {
  props: {...TextDefaultProps, ...defaultProps},
  related: {
    settings: TextSettings,
  },
};

/*
.example::-webkit-scrollbar {
  display: none;
}

.example {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
} */


