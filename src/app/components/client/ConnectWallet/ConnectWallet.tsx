"use client";

import { useStoreWallet } from './walletContext';
import styles from './page.module.css'

import { Box, Button, Center, ChakraProvider, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { StarknetWindowObject } from "get-starknet";
import { Account, encode, RpcProvider, shortString, constants as SNconstants } from "starknet";
import SelectWallet from './SelectWallet';
import { devnetAccountAddress, networkName } from '@/app/utils/constants';


export default function ConnectWallet() {
  const addressAccount = useStoreWallet(state => state.addressAccount);
  const wallet = useStoreWallet(state => state.wallet)

  const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);
  const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);

  const chainFromContext = useStoreWallet(state => state.chain);
  const setChain = useStoreWallet(state => state.setChain);

  const providerFromContext = useStoreWallet(state => state.provider);
  const setProvider = useStoreWallet(state => state.setProvider);

  const addressAccountFromContext = useStoreWallet(state => state.addressAccount);
  const setAddressAccount = useStoreWallet(state => state.setAddressAccount);

  const isConnected = useStoreWallet(state => state.isConnected);
  const setConnected = useStoreWallet(state => state.setConnected);

  const devnetAccount = ()=>{
    setConnected(true); // zustand
    setAddressAccount(devnetAccountAddress); // zustand
  }

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
