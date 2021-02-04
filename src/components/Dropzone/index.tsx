import React from 'react';
import { Stack, Image, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

import folder from '../../../assets/folder.svg';

interface DropzoneProps {
  onDrop: (file: any) => void;
}

function Dropzone({ onDrop }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      border="1px dashed #97BEFF"
      padding="2rem 10rem"
      backgroundColor="#FBFBFF"
      borderRadius="10px"
      color="#C8C7C8"
      spacing="0.5rem"
      cursor="pointer"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Image src={folder} width="50px" alt="folder" />
      {isDragActive ? <Text>Drop them!</Text> : <Text>Drop your files</Text>}
    </Stack>
  );
}

export default Dropzone;
