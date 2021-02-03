import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onDrop: (file: any) => void;
}

function Dropzone({ onDrop }: DropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isDragActive,
  } = useDropzone({
    onDrop,
  });

  const acceptedFile = acceptedFiles[0];

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      outline="2px dashed black"
      padding="1rem"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {acceptedFile ? (
        <Text fontSize="1.5rem">{acceptedFile.name}</Text>
      ) : isDragActive ? (
        <Text fontSize="1.5rem">Drop it!</Text>
      ) : (
        <Text>Drop the file here</Text>
      )}
    </Flex>
  );
}

export default Dropzone;
