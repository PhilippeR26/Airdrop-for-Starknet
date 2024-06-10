"use client";

import { RpcProvider, WalletAccount, addAddressPadding, shortString } from 'starknet';
import { Button, ChakraProvider } from "@chakra-ui/react";

import { useStoreWallet } from './walletContext';
import SelectWallet from './SelectWallet';

import { networkName } from '@/app/utils/constants';
import type { StarknetWindowObject } from 'get-starknet-core';
import { useEffect } from 'react';
import { myProviderUrl } from '@/app/utils/constants';

export default function ConnectWallet() {
  const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);
  const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);

  const myWallet = useStoreWallet(state => state.wallet);
  const setMyWallet = useStoreWallet(state => state.setMyWallet);
  
  
  const chainFromContext = useStoreWallet(state => state.chain);
  const setChain = useStoreWallet(state => state.setChain);
  
  const addressAccountFromContext = useStoreWallet(state => state.addressAccount);
  const setAddressAccount = useStoreWallet(state => state.setAddressAccount);
  const myWalletAccount = useStoreWallet(state => state.myWalletAccount);
  const setMyWalletAccount = useStoreWallet(state => state.setMyWalletAccount);

  const isConnected = useStoreWallet(state => state.isConnected);
  const setConnected = useStoreWallet(state => state.setConnected);

  const handleSelectedWalletNew = async (wallet: StarknetWindowObject) => {
    const accountAddress = await wallet.request({ type: "wallet_requestAccounts" });
    console.log("account address from wallet =", accountAddress);
    setAddressAccount(addAddressPadding(accountAddress[0])); // zustand
    const chainId = (await wallet.request({ type: "wallet_requestChainId" })).toString();
    setChain(chainId); // zustand
    setSelectWalletUI(false); // zustand
    setConnected(true); // zustand
    setMyWalletAccount(new WalletAccount(new RpcProvider({ nodeUrl: myProviderUrl }), wallet)); // zustand
  }



  useEffect(
    () => {
      console.log("try to initialize wallet.")
      if (!!myWallet) {
        handleSelectedWalletNew(myWallet).then((_res) => console.log("wallet initialized."));
      }
      return () => { }
    },
    [myWallet]
  );



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
              onClick={() => {
                setSelectWalletUI(true);
                setMyWallet(undefined);
              }} // Mainnet
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
                setSelectWalletUI(false);
                setAddressAccount("");
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
