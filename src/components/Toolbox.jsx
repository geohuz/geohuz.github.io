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
import {genSlateContent} from '../utils'

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
            ref={(ref) => connectors.create(ref, <Text text={genSlateContent("文本")} />)}
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
                  {/* must have a text component, otherwise can't drag in */}
                  <Text text={genSlateContent("行容器")} />
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
                  {/* must have a text component, otherwise can't drag in */}
                  <Text text={genSlateContent("列容器")} />
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

