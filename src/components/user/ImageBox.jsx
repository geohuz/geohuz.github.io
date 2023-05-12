import { styled } from "@mui/system";
import { grey } from "@mui/material/colors";
import { useDropzone } from "react-dropzone";
import { useState } from 'react'
import { useNode, useEditor } from '@craftjs/core';
import { useEffect } from 'react'
import { Resizer } from '../Resizer' 
import {createRef} from 'react'
import Dropzone from 'react-dropzone';

export const dropzoneRef = createRef()

const defaultProps = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  padding: ['0', '0', '0', '0'],
  margin: ['0', '0', '0', '0'],
//  background: { r: 255, g: 255, b: 255, a: 1 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  shadow: 0,
  radius: 0,
  width: '100px',
  height: '100px',
};


export function ImageBox(props) {
  props = {
    ...defaultProps,
    ...props,
  };
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
    children,
  } = props

  const {
    connectors: { connect, drag },
  } = useNode()

  const [img, setImg] = useState()

  const disabled = false;

  return (
    <Resizer
      propKey={{ width: 'width', height: 'height' }}
      style={{
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
      <Dropzone ref={dropzoneRef} noClick noKeyboard>
        {({getRootProps, getInputProps, acceptedFiles}) => {
          return (
            <>
            <input multiple={false} {...getInputProps()} />
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              src={acceptedFiles.length!==0 ? URL.createObjectURL(acceptedFiles[0]) : undefined}
            />
            </>
          )
        }}
      </Dropzone>
    </Resizer>
  )
}

ImageBox.craft = {
  displayName: 'Image',
  props: defaultProps,
  rules: {
    canDrag: () => true,
    canDrop: () => true,
  },
};
