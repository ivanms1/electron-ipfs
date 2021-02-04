import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';

import Dropzone from '../../components/Dropzone';
import UploadedFile from './UploadedFile';

import styles from './Home.module.css';

function Home() {
  const [uploadedfiles, setUploadedfiles] = useState([]);

  const handleUpload = async (files: any) => {
    const data = await ipcRenderer.invoke(
      'upload-file',
      files.map((file: { path: string; name: string }) => ({
        path: file.path,
        name: file.name,
      }))
    );

    setUploadedfiles([...uploadedfiles, ...data]);
  };

  return (
    <Stack
      spacing="2rem"
      backgroundColor="#FFFFFF"
      padding="4rem 4rem"
      borderRadius="25px"
      boxShadow="0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20)"
      minWidth="40rem"
    >
      <Text fontSize="1.8rem" textAlign="center">
        Upload your files
      </Text>
      <Dropzone onDrop={handleUpload} />
      <Stack>
        {uploadedfiles.length && (
          <HStack justifyContent="space-between">
            <Text color="#C8C7C8" fontSize="1.2rem">
              Uploaded Files
            </Text>
            <Button
              type="button"
              variant="outline"
              color="#C8C7C8"
              size="xs"
              onClick={() => setUploadedfiles([])}
            >
              Clear
            </Button>
          </HStack>
        )}
        <Stack
          maxHeight="300px"
          overflowY="auto"
          paddingRight="0.5rem"
          className={styles.FilesContainer}
        >
          <AnimatePresence>
            {uploadedfiles.map(
              (file: { path: string; name: string; hash?: string }, index) => (
                <UploadedFile
                  key={`${file.name}_${file.path}_${index}`}
                  file={file}
                />
              )
            )}
          </AnimatePresence>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Home;
