import React from 'react';
import Toast from 'react-native-toast-message';

export const ErrorToast = () => (
  <Toast
    config={{
      error: ({ text1, text2 }) => (
        <Toast.Base
          text1={text1}
          text2={text2}
          style={{ borderLeftColor: '#d14343' }}
          text1Style={{ fontSize: 16, fontWeight: '700' }}
          text2Style={{ fontSize: 14 }}
        />
      ),
    }}
  />
);

export const showApiErrorToast = (message: string) => {
  Toast.show({
    type: 'error',
    text1: 'Une erreur est survenue',
    text2: message,
  });
};
