import { Button, HStack, Stack, Text, useToast } from '@chakra-ui/react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';
import React, { useState } from 'react';

import Download from './Download';
import Upload from './Upload';
import Preview from './Preview';

const components = [
  { id: 'Upload', component: Upload, color: 'blue' },
  { id: 'Download', component: Download, color: 'green' },
  { id: 'Preview', component: Preview, color: 'purple' },
];

function Home() {
  const [selectPage, setSelectPage] = useState('');
  const [imageHashes, setImageHashes] = useState<string[]>([]);

  const toast = useToast();

  const Component = components.find((c) => c.id === selectPage)?.component;

  const handleImageHashes = (hash: string) => {
    if (!imageHashes.includes(hash)) {
      setImageHashes([...imageHashes, hash]);
      toast({
        title: 'Hash added',
        status: 'success',
        duration: 500,
      });
    } else {
      toast({
        title: 'Hash already added',
        status: 'error',
        duration: 500,
      });
    }
  };

  return (
    <AnimateSharedLayout>
      <Stack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        spacing="2rem"
      >
        <Text textAlign="center" fontSize="1.5rem">
          Conun IPFS Network
        </Text>
        <HStack justifyContent="space-around">
          {components.map((c) => (
            <motion.div key={c.id} layoutId={c.id}>
              <Button
                _focus={{ outline: 'none' }}
                type="button"
                onClick={() => setSelectPage(c.id)}
                colorScheme={c.color}
              >
                {c.id}
              </Button>
            </motion.div>
          ))}
        </HStack>
      </Stack>

      <AnimatePresence>
        {selectPage && (
          <ClickAwayListener onClickAway={() => setSelectPage('')}>
            <Component
              layoutId={selectPage}
              onClose={() => setSelectPage('')}
              imageHashes={imageHashes}
              handleImageHashes={handleImageHashes}
            />
          </ClickAwayListener>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
}

export default Home;
