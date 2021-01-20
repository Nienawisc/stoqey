import React from 'react';
import { AppLoading } from 'expo';

import { useLoadAssets, Assets } from '../hooks';

/**
 * screen @interface
 */
interface IProps {
  assets: Assets;
  children: React.ReactNode;
}
/**
 * component to render splash screen when loading assets,
 * or load the passed children components otherwise.
 */

export default React.memo(({ assets, children }: IProps) => {
  const [ready] = useLoadAssets(assets);
  if (!ready) {
    return <AppLoading />;
  }
  return <>{children}</>;
});
