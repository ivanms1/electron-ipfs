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

const defaultImageHashes = [
  'QmcSkVnhkM9NUZDrgeXoEEMo4Kg8Mha9gZiNGUSH4W5tMQ',
  'QmQmYFxU4q7jFfc9aA7oQdD2oCNTNeZYvMu6vpyXxkLhQr',
  'QmfPjmutwXjqwTgaqp6VYrak2CUKqWePBsfV3JFjR4qokV',
  'QmRxNwcHvbc169LyvSBp9oHRPfZ2aXMvF8vbyP41nPkdsv',
  'QmW9kbr5tNjkQVjSWGAHeoXwF4JGSEcGpzUukFLXb2aNAM',
  'QmWFLFSpVwyLgJZko8qG2e2QgLQsDUZGKy6wz1Y1d2zuVq',
  'QmRNZNmchRkp7Ggb5hrP5M6UKTA1vptxnyzg6jF77Pjha1',
  'QmfMfxpPkPJsuQS6bLJWsEALr2e5h3BeavxY884coCjDSS',
  'QmXqp769KWuUMMQRLWcedn3aAca5Jn6Axv18QSJbKLzSib',
  'QmZCSAeoonVSywMNHx4J8asd1adNjoFopkp2VgXiUPnNVu',
  'QmeYzHaCn4DfbC1Cy9HaZAkWpRHwNW9z5vQ51jD2oY3AfH',
  'QmeAc3ihmXrVCqHcAg4PcCqBFrhMaCvv6jvqHva72QWQuV',
  'QmT9PPQkRhaEgytuDaGVQbvTk9uKCDUSV9VxwmWsokrDTH',
  'QmeESidemusGDgRh7QDYzDM5i6UsGZsTrbihoAzU1rYres',
  'QmS1fo7qgwL9YYcGQG5x8Pi6ZtmcQFM5H3GBUiip6WteDF',
  'QmSq1cH2v94HwznzpXKbk5sPHbC17YVzaUqpQhJVjQ9onv',
  'QmdzhyfdmvP9cKZB299PuUeBe6BjYyN7SEww4zz8KkvH6m',
  'QmSxeHa4mmdT7Av1NnjYtvNUvrQSCkQcjgnwrxDVQwPzdZ',
  'QmVFBb3E4TQj8k5qiWZhBb7bAVnJxDjbyt5rvectkpRRom',
  'QmU9sAizWNDFo3uhrqFcuiYVbVXAfkKrSPgVBBeQ4Abbpb',
  'QmVCPKwYwYyaGDT4ShNtogtFG6YybNb1x8ddjZiEMeyH46',
];

function Home() {
  const [selectPage, setSelectPage] = useState('');
  const [imageHashes, setImageHashes] = useState<string[]>(defaultImageHashes);

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
