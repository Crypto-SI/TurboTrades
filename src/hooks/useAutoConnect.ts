"use client"
import React from 'react';
import { AutoConnectContext } from '@/contexts/AutoConnectContext';

const useAutoConnect = () => {
  const context = React.useContext(AutoConnectContext);

  if (!context) {
    throw "can't read context";
  } else {
    return context;
  }
}

export default useAutoConnect;