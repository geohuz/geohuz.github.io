import { useEditor, Element } from '@craftjs/core';
import {
  Box,
  Typography,
  Grid,
  Button as MaterialButton,
} from '@mui/material';
import React from 'react';

import { Container } from './user/Container';
import { Text } from './user/Text';
import { ImageBox} from './user/ImageBox'

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <Box px={2} py={2}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={1}
      >
        <Box pb={2}>
          <Typography>Drag to add</Typography>
        </Box>
        <Grid container direction="column" item>
          <MaterialButton
            ref={(ref) => connectors.create(ref, <Text text="文本" />)}
            variant="contained"
            data-cy="toolbox-text"
          >
            Text
          </MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton
            ref={(ref) =>
              connectors.create(
                ref,
                 <Element id="Container" canvas is={Container} custom={{displayName: "hContainer"}}>
                  {/* 必须带上text, 否则后续无法拖入 */}
                  <Text text="行容器" />
                 </Element>
              )
            }
            variant="contained"
            data-cy="toolbox-container"
          >
            行容器
          </MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton
            ref={(ref) =>
              connectors.create(
                ref,
                 <Element id="Container" canvas is={Container} custom={{direction: "column", displayName: "vContainer"}}>
                  {/* 必须带上text, 否则后续无法拖入 */}
                  <Text text="列容器" />
                 </Element>
              )
            }
            variant="contained"
            data-cy="toolbox-container"
          >
            列容器
          </MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton
            ref={(ref) => connectors.create(ref, <ImageBox displayName="image"/>)}
            variant="contained"
            data-cy="toolbox-image"
          >
            图片
          </MaterialButton>
        </Grid>
      </Grid>
    </Box>
  );
};

