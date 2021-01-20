import { useState, useEffect } from 'react';
import { Image, ImageRequireSource } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

type LoaderType = [boolean];

export interface Assets {
  images: ImageRequireSource[];
  fonts: { [key: string]: number } | any;
}

// guarantee loading all resources (images, and fonts) to faster rendering.
const usePromiseAll = (promises: Promise<void | void[]>[], cb: () => void) =>
  useEffect(() => {
    (async () => {
      await Promise.all(promises);
      cb();
    })();
  });

// loading all assets (fonts, images) using promises.
export const useLoadAssets = (assets: Assets): LoaderType => {
  const [loaded, setLoaded] = useState(false);
  const cacheFonts = Font.loadAsync(assets.fonts);
  usePromiseAll(
    [
      cacheFonts,
      ...assets.images.map(image => {
        if (typeof image === 'string') {
          return Image.prefetch(image);
        } else {
          return Asset.fromModule(image).downloadAsync();
        }
      }),
    ],
    () => setLoaded(true),
  );
  return [loaded];
};
