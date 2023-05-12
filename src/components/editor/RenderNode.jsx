import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled'

import ArrowUp from '../../assets/icons/arrow-up.svg';
import Delete from '../../assets/icons/delete.svg';
import Move from '../../assets/icons/move.svg';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import {useDropzone} from 'react-dropzone';
import {dropzoneRef} from '../user/ImageBox'

const openDialog = () => {
  if (dropzoneRef.current) {
    dropzoneRef.current.open()
  }
};

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  font-size: 12px;
  line-height: 12px;

  svg {
    fill: #fff;
    width: 15px;
    height: 15px;
  }
`;

const Btn = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }
`;

const RenderNode = ({ render }) => {
  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true
  });

  const { id, richTextMode, actions: { setProp } } = useNode(node=> ({
    richTextMode: node.data.props.richTextMode
  }));

  const { actions, query, state, isActive } = useEditor((state, query) => {
    let isActive 
    let selectedId = query.getEvent('selected').last()
    if (selectedId===id) {
      isActive = true
    }
    if (selectedId===undefined) {
      isActive = false
    }
    // isActive: 
    // true: on the node selected, 
    // undefined: not on selected node 
    // false: there is nothing get selected
    return { isActive: isActive }
  })

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const currentRef = useRef();

  useEffect(() => {
    // 加虚线框
    if (dom) {
      if (isActive!==undefined && isHover) dom.classList.add('component-selected')
      else dom.classList.remove('component-selected');
      // if (isHover) dom.classList.add('component-selected');
      // if (isActive) dom.classList.remove('component-selected');
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  
  const scroll = useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM) return;
    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    document
      .querySelector('.craftjsRenderer')
      .addEventListener('scroll', scroll);

    return () => {
      document
        .querySelector('.craftjsRenderer')
        .removeEventListener('scroll', scroll);
    };
  }, [scroll]);

  return (
    <>
      {/* 如果没有active则会错误的显示parent */}
      { !richTextMode && isActive || (isActive===false && isHover) 
        ? ReactDOM.createPortal(
            <IndicatorDiv
              ref={currentRef}
              className="px-2 py-2 text-white bg-primary fixed flex items-center"
              style={{
                opacity: 0.8,
                left: getPos(dom).left,
                top: getPos(dom).top,
                zIndex: 9999,
              }}
            >
              { isActive && name==="Text"? (
                <Btn
                  className="mr-1 cursor-pointer"
                >
                  <EditIcon onClick={()=>{
                    setProp(props=> {
                      props.richTextMode = true}
                    )
                  }}/>
                </Btn>
                ): null
              }
              {moveable ? (
                <Btn className="mr-1 cursor-move" ref={drag}>
                  <Move />
                </Btn>
              ) : null}
              {/* {id !== ROOT_NODE && ( */}
              {/*   <Btn */}
              {/*     className="mr-1 cursor-pointer" */}
              {/*     onClick={() => { */}
              {/*       actions.selectNode(parent); */}
              {/*     }} */}
              {/*   > */}
              {/*     <ArrowUp /> */}
              {/*   </Btn> */}
              {/* )} */}
              {deletable ? (
                <Btn
                  className="mr-1 cursor-pointer"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <Delete />
                </Btn>
              ) : null}
              {name==="Image" ? (
                <Btn
                  className="ml-2 cursor-pointer"
                  onClick={openDialog}
                >
                  <AddPhotoAlternateIcon />
                </Btn>
               ) : null}
              <h2 className="flex-1 ml-2">{name}</h2>
            </IndicatorDiv>,
            document.querySelector('.nodeContainer')
          )
        : null}
      {render}
    </>
  );
};

export default RenderNode
// export default observer(RenderNode)
{/* appStore.textAreaOverflow &&  */}

