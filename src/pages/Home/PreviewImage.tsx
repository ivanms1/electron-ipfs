import React from 'react';
import { ipcRenderer } from 'electron';
import { useQuery } from 'react-query';
import { Image } from '@chakra-ui/react';

const previewImage = async (hash: string) => {
  const data = await ipcRenderer.invoke('get-image-preview', hash);

  const newFile = new Blob([data.file.buffer]);

  return URL.createObjectURL(newFile);
};

interface PreviewImageProps {
  hash: string;
}

function PreviewImage({ hash }: PreviewImageProps) {
  const { data, isLoading } = useQuery(
    ['get-preview', hash],
    () => previewImage(hash),
    { enabled: !!hash }
  );

  return isLoading ? (
    <p>Loading ...</p>
  ) : (
    <Image width="250px" height="250px" objectFit="contain" src={data} />
  );
}

export default PreviewImage;
