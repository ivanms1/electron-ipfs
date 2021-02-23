import { Button, HStack, Stack, Text, useToast } from '@chakra-ui/react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';
import React, { useState } from 'react';

import Download from './Download';
import Upload from './Upload';
import Preview from './Preview';
import MyFiles from './MyFiles';

const components = [
  { id: 'Upload', component: Upload, color: 'blue' },
  { id: 'Download', component: Download, color: 'green' },
  { id: 'Preview', component: Preview, color: 'purple' },
  { id: 'MyFiles', component: MyFiles, color: 'yellow' },
];

function Home() {
  const [selectPage, setSelectPage] = useState('');

  const Component = components.find((c) => c.id === selectPage)?.component;

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
            />
          </ClickAwayListener>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
}

export default Home;
