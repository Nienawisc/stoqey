import React from 'react';
import { Root } from 'native-base';
import { StoreProvider } from './store';
import Router from './navigation/Navigator';
import FlashMessage from 'react-native-flash-message';
import { AssetsLoader } from './components';
import { YellowBox, ImageRequireSource } from 'react-native';
import { RootAppWithApollo } from './api/RootAppWithApollo';
YellowBox.ignoreWarnings(['VirtualizedLists', 'Non-serializable']);

const images: ImageRequireSource[] = [require('./assets/stoqey_robot.png'), require('./assets/icon.png')];
const fonts: { [key: string]: number } | any = {
  // ...Icon.Ionicons.font,
  Roboto: require('native-base/Fonts/Roboto.ttf'),
  Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
};

const App: React.FC<any> = () => <Router />;

const AppWithApollo = RootAppWithApollo(App);

const AppContainer: React.FC<any> = () => {
  return (
    <Root>
      <StoreProvider>
        <AssetsLoader assets={{ images, fonts }}>
          <AppWithApollo />
        </AssetsLoader>
        <FlashMessage position="top" />
      </StoreProvider>
    </Root>
  );
};

export default AppContainer;
