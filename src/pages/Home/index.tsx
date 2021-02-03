import React from 'react';
import { Stack, Text } from '@chakra-ui/react';

import Dropzone from '../../components/Dropzone';

function Home() {
  return (
    <Stack spacing="1rem">
      <Text fontSize="2rem">Drop your files here</Text>
      <Dropzone onDrop={(e) => console.log(e)} />
    </Stack>
  );
}

export default Home;
