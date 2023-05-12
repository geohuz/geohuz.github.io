import { useNode, useEditor as useEditor } from '@craftjs/core';
import { Slider, FormControl, FormLabel } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { Resizer } from '../Resizer'
import {css} from '@emotion/react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { styled } from '@mui/material/styles';
import RichEditor from '../RichEditor'

const MoreTextButton = styled(Button)`
  padding: 0px;
  line-height: 1.5;
  text-transform: initial;
  vertical-align: top;
  display: block;
  width: 100%;
  height: 100%;
  text-align: left;
`

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

export const Text = ({ text, fontSize, textAlign, ...props }) => {
  const [isEditable, setEditable] = useState(false)
  const [simpleEditorData, setSimpleEditorData] = useState(
    [{
      type: 'paragraph',
      children: [
        {text: "输入文字"},
      ]
    }]
  )

  const {
    id: id,
    selected,
    overflow_y,
    richTextMode,
    presentationMode,
    actions: { setProp },
  } = useNode(node=> {
    return {
      richTextMode: node.data.props.richTextMode,
      presentationMode: node.data.props.presentationMode,
      selected: node.events.selected,
      overflow_y: node.data.props.overflow_y,
    }
  })

  const simpleEditorRef = useRef()

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

  // 必须带上state调用， 否则报错, 因为这是有次序的
  const { globalEnabled, actions, isActive} = useEditor((state, query) => {
    let isActive
    let selectedId = query.getEvent('selected').last()
    if (selectedId===id) {
       isActive = true
    } else isActive = false
    return {
      isActive: isActive,
      globalEnabled: state.options.enabled,
    }
  })

  function editorContentChangeHanlder(value) {
    setSimpleEditorData(value)
  }

  function applyChange () {
    simpleEditorRef.current.applyContent(simpleEditorData)
    if (simpleEditorData[0].children) {
      if (simpleEditorData[0].children[0].text==="") {
        actions.delete(id)
      }
    }
  }

  useEffect(() => {
    if (selected) {
      return 
    } 
    setEditable(false)
  }, [selected])

  return (
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
      <div
        onClick={()=>selected && setEditable(true)}
        css={css`
          width: 100%;
          height: 100%;
          overflow: hidden;
        `}
      >
        <CondWrapper
          condition={!globalEnabled && overflow_y}
          wrapper={children => 
            <MoreTextButton onClick={
                ()=>setProp(props=>props.presentationMode = true)
              } 
              variant="text" 
            >
              {children}
            </MoreTextButton>
          }
        >
          <RichEditor
            ref={simpleEditorRef}
            withToolbar={false}
            initialValue={simpleEditorData}
            onChange={editorContentChangeHanlder}
            editorStyle={css`
              font-size: ${fontSize}px;
              text-align: ${textAlign}
            `}
            readOnly={!isEditable}
            onBlur={()=> {
              if (simpleEditorData[0].children) {
                if (simpleEditorData[0].children[0].text==="") {
                  actions.delete(id)
                }
              }
            }}
          />
        </CondWrapper>
        {/* must use isActive to limit the modals!! */}
        {(isActive || presentationMode) &&  
          <PopupEditor 
            setProp={setProp}
            open={richTextMode || presentationMode} 
            content={simpleEditorData}
            onChange={editorContentChangeHanlder}
            applyChange={applyChange}
            presentationMode={presentationMode}
          />
        }
      </div>
      </Resizer>
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
          value={fontSize || 2}
          step={2}
          min={12}
          max={30}
          onChange={(_, value) => {
            setProp((props) => (props.fontSize = value), 1000);
          }}
        />
      </FormControl>
    </>
  );
};

function PopupEditor({open, content, onChange, applyChange, setProp, presentationMode}) {
  const handleApply = () => {
    applyChange()
    setProp(props=>props.richTextMode=false)
  };

  const editorStyle = css`
            overflow-y: auto; 
            overflow-x: hidden; 
            padding: 20px; 
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            `
  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        onClose={()=> {
          if (presentationMode) setProp(props=>props.presentationMode=false)
          else setProp(props=>props.richTextMode=false)
        }}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {open &&
          <RichEditor 
            withToolbar={!presentationMode}
            initialValue={content} 
            onChange={onChange}
            readOnly={presentationMode}
            editorStyle={editorStyle}
          />
        }
        <DialogActions>
          {!presentationMode? 
            <Button onClick={handleApply}>Apply Change</Button>
            :
            <Button onClick={
              ()=>setProp(props=>props.presentationMode=false)}>
              Close
            </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

const CondWrapper = ({ children, condition, wrapper }) =>
  condition ? wrapper(children) : children

export const TextDefaultProps = {
  text: 'Hi',
  richTextMode: false,
  presentationMode: false,
  fontSize: 14,
};

Text.craft = {
  props: {...TextDefaultProps, ...defaultProps},
  related: {
    settings: TextSettings,
  },
};

