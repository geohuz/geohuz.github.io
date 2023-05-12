import { Editor, Frame, Element } from '@craftjs/core';
// import {Layers} from '@craftjs/layers'
import { Paper } from '@mui/material';
import { SettingsPanel } from './components/SettingsPanel';
import { Toolbox } from './components/Toolbox';
import { Topbar } from './components/Topbar';
import { NodeFrame } from './components/user/NodeFrame';
import { Container } from './components/user/Container'
import { ImageBox } from './components/user/ImageBox'
import { Text } from './components/user/Text';
import { css } from '@emotion/react';
import RenderNode  from './components/editor/RenderNode'
import { Viewport } from './components/editor/ViewPort' 
import './App.css'

export default function App() {
  return (
    <div style={{ margin: '0 auto'}}>
      <Editor
        resolver={{
          Container,
          Text,
          NodeFrame,
          ImageBox,
        }}
        indicator={{
          'success': '#2d9d78', // green
          'error': '#e34850', // red
          'thickness': 3 
        }}
        onRender = { RenderNode }
      >
        {/* 顶部控制栏 */}
        <Topbar /> 
        <Viewport>
          {/* 节点编辑区域 */}
          <Frame>
            <Element
              canvas
              is={NodeFrame}
              padding={5}
              background="#eee"
              data-cy="nodeFrame"
            >
              <Element
                canvas
                is={Container}
                custom={{displayName: "hContainer"}}
                // padding={['0', '20', '0', '20']}
              >
                <Text text={'行容器'} /> 
                <Element
                  canvas
                  is={Container}
                  custom={{
                    direction: "column", 
                    displayName: "vContainer"
                  }}
                >
                  <ImageBox />
                </Element>
              </Element>
            </Element>
          </Frame>
        </Viewport>
        {/* 右边控制栏 */}
        <Paper css={css`
            padding: 0;
            background: rgb(252, 253, 253);
          `}>
          <Toolbox />
          <SettingsPanel />
          {/* <Layers /> */}
        </Paper>
      </Editor>
    </div>
  );
}
