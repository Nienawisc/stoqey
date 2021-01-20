import { Toast } from 'native-base';

export const showToast = (message: string, success?: boolean) => {
  Toast.show({
    position: 'top',
    text: message,
    buttonText: success ? '✅' : '❌',
  });
};
