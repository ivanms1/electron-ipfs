import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';
import React, { useState } from 'react';
import Download from './Download';
import Upload from './Upload';

const components = [
  { id: 'Upload', component: Upload },
  { id: 'Download', component: Download },
];

function Home() {
  const [selectPage, setSelectPage] = useState('');

  const Component = components.find((c) => c.id === selectPage)?.component;

  return (
    <AnimateSharedLayout>
      <Stack spacing="2rem">
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
                colorScheme={c.id === 'Upload' ? 'blue' : 'green'}
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
