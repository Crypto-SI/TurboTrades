"use client"
import React from 'react';
import { MetamaskContext } from '@/contexts/MetamaskContext';

const useMetamask = () => {
  const context = React.useContext(MetamaskContext);

  if (!context) {
    throw "can't read context";
  } else {
    return context;
  }
}

export default useMetamask;