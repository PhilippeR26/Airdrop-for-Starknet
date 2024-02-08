"use client";

import { shortString } from 'starknet';
import { Button, ChakraProvider } from "@chakra-ui/react";

import { useStoreWallet } from './walletContext';
import SelectWallet from './SelectWallet';

import { networkName } from '@/app/utils/constants';

export default function ConnectWallet() {  
  const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);
  const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);
  
  const chainFromContext = useStoreWallet(state => state.chain);
  const setChain = useStoreWallet(state => state.setChain);
  
  const addressAccountFromContext = useStoreWallet(state => state.addressAccount);
  const setAddressAccount = useStoreWallet(state => state.setAddressAccount);

  const isConnected = useStoreWallet(state => state.isConnected);
  const setConnected = useStoreWallet(state => state.setConnected);

  // const devnetAccount = ()=>{
  //   setConnected(true); // zustand
  //   setAddressAccount(devnetAccountAddress); // zustand
  // }

  return (
    <ChakraProvider>

      <div>
        {!isConnected ? (
          <>
            <Button
              colorScheme='pink'
              ml="4"
              marginTop={1}
              marginBottom={1}
              onClick={() => setSelectWalletUI(true)} // Mainnet
            // onClick={devnetAccount} // devnet
            >
              Connect a {networkName} Wallet
            </Button>
            {displaySelectWalletUI ? <SelectWallet></SelectWallet> : null}
          </>
        ) : (
          <>
            <Button
              colorScheme='pink'
              ml="4"
              marginTop={1}
              marginBottom={1}
              onClick={() => {
                setConnected(false);
                setSelectWalletUI(false)
              }}
            >
              {addressAccountFromContext
                ? `Your account : ${addressAccountFromContext?.slice(0, 6)}...${addressAccountFromContext?.slice(-4)} in ${shortString.decodeShortString(chainFromContext)} is connected`
                : "No Account"}
            </Button>
          </>
        )
        }
      </div>

    </ChakraProvider>
  )
}
