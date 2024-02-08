"use client";

import { addAddressPadding, shortString } from 'starknet';
import { Button, ChakraProvider } from "@chakra-ui/react";

import { useStoreWallet } from './walletContext';
import SelectWallet from './SelectWallet';

import { networkName } from '@/app/utils/constants';
import { StarknetWindowObject } from './core/StarknetWindowObject';
import { Permission } from './core/rpcMessage';
import { useEffect } from 'react';

export default function ConnectWallet() {
  const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);
  const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);

  const myWallet = useStoreWallet(state => state.wallet);
  const setMyWallet = useStoreWallet(state => state.setMyWallet);


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

  const handleSelectedWalletNew = async (wallet: StarknetWindowObject) => {
    // let respRequest: Permission[] = [];
    // try {
    //   console.log("Trying to connect wallet=", wallet);

    //   respRequest = await wallet.request({ type: "wallet_getPermissions" });
    //   console.log("permissions =", respRequest)
    // } catch (err:any) {
    //   console.log("Error when request permissions :", err.message);
    // }
    // // .includes(Permission.Accounts)
    // if (respRequest[0]=="accounts") {
    //   console.log("permissions=OK");
    //setHasPermissions(true);
    setMyWallet(wallet); // zustand
    setConnected(true); // zustand
    const accounts = await wallet.request({ type: "wallet_requestAccounts" });
    console.log("account address from wallet =", accounts);
    // setAccount(accounts[0]); // zustand
    setAddressAccount(addAddressPadding(accounts[0])); // zustand
    const chainId = (await wallet.request({ type: "wallet_requestChainId" })).toString();
    setChain(chainId);
    setSelectWalletUI(false);
    // } else {
    //   console.log("permissions=Denied");
    // }
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
