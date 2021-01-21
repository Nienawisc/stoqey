import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import WebView from 'react-native-webview';
import { HOST, log } from '../../config';

interface Props {
  amount: number;
  userId: string;
  currency?: string;
  success: (data: any) => Promise<any>;
  failed: (data: any) => Promise<any>;
}

const PayPalCheckout = (props: Props) => {
  const { amount = 100, userId = 'userid', success, failed } = props;
  const paymentUrl = `http://${HOST}/payment/${amount}/${userId}`;

  log.info(`amount=${amount} userId=${userId}`)
  const webview: any = React.useRef<WebView>();

  const [state, setState] = useState({
    loading: false,
    sent: false,
  });

  const injectedJavascript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
  })()`;

  const handleNavigation = event => {
    // 'handleNavigation' in props && props.handleNavigation(event);
  };

  const handleMessage = event => {
    let data = event.nativeEvent.data;
    data = JSON.parse(data);

    log.info('handleMessages ' + JSON.stringify(data));

    // if (data.status == 'success') {
    //   success(data);
    // } else {
    //   setState({
    //     ...state,
    //     loading: false,
    //   });
    //   failed(data);
    // }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ overflow: 'scroll' }}
        source={{ uri: paymentUrl }}
        originWhitelist={['*']}
        mixedContentMode={'always'}
        useWebKit={Platform.OS == 'ios'}
        ref={webview}
        thirdPartyCookiesEnabled={true}
        scrollEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={injectedJavascript}
        onMessage={event => handleMessage(event)}
        javaScriptEnabled={true}
      />
    </View>
  );
};

export default PayPalCheckout;
