import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [state, setState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const subscription = NetInfo.addEventListener((info) => setState(info));
    NetInfo.fetch().then(setState);
    return () => subscription();
  }, []);

  return {
    isOffline: state ? !(state.isConnected && state.isInternetReachable !== false) : false,
    type: state?.type ?? 'unknown',
    details: state?.details,
  };
};
