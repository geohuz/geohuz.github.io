import { useEditor, useNode } from '@craftjs/core';
import {useState, useRef, useEffect, useContext} from 'react'

export const Viewport = ({
  children,
}) => {

  const { actions, connectors } = useEditor()

  return (
    <div className="viewport">
      <div className="nodeContainer">
        <div
          className='craftjsRenderer'
          style={{ paddingTop: '20px' }}
          ref={dom => { 
            connectors.select(connectors.hover(dom, null), null)
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

