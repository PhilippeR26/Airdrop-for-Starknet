"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { Center, Spinner, Text, Button } from '@chakra-ui/react';
import ClientComponent from './components/client/ClientComponent';
import { MerkleDisplay } from './components/MerkleDisplay';
import ClientMerkle from "./components/client/ClientMerkle";
import WalletConnect from "./components/client/WalletConnect";
import BlockDisplay from './components/client/Block/BlockDisplay';

import { useEffect, useState } from "react";
import { ChakraProvider } from '@chakra-ui/react'

import { AccountInterface, Contract, shortString, json, ProviderInterface, encode } from "starknet";
import { StarknetWindowObject, connect } from "get-wallet-starknet";

import { contratSierra } from "./compiledContracts/test_type1_sierra";

// import {
//   addWalletChangeListener,
//   chainId,
//   connectWallet,
//   removeWalletChangeListener,
//   silentConnectWallet,
// } from "../app/services/wallet.service";

import airdropImg from '../../public/Images/airdrop-for-Starknet.png'
import { use } from 'react';

// async function fetchProof(addr: string): Promise<string> {
//   // let data1: string = "En attente";
//   const result = await fetch('http://127.0.0.1:3000/api/merkle?addr=0x123', { cache: "no-cache" })
//   // console.log('resullt =', result.body);
//   if (!result.ok) {
//     throw new Error('Failed to read Merkle Tree : ' + result.status + " , " + result.statusText);
//   }
//   const re = await result.json();
//   console.log("result1=", re);
//   return "wwwwwwww";
// }
// contrat already deployed in testnet:
const ContractAddress = "0x697d3bc2e38d57752c28be0432771f4312d070174ae54eef67dd29e4afb174";

export default function Page() {

    // const data1 =  fetchProof("0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a");
    // const data2=use(data1);
    // console.log("data1 =", data1);

    // <Spinner color="white" size="xl" />

    // const result=use(fetchProof("0x123"));
    const [address, setAddress] = useState<string>();
    //const [supportSessions, setSupportsSessions] = useState<boolean | null>(null);
    const [chain, setChain] = useState("");
    const [isConnected, setConnected] = useState(false);
    const [account, setAccount] = useState<AccountInterface | null>(null);
    const [myProvider, setMyProvider] = useState<ProviderInterface | null>(null);
    const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);


    const handleConnectClick = async () => {
        //const wallet = await connectWallet()
        const wallet = await connect({ modalMode: "alwaysAsk", modalTheme: "dark" });
        await wallet?.enable({ starknetVersion: "v5" } as any);
        setWallet(wallet);
        const addr = encode.addHexPrefix(encode.removeHexPrefix(wallet?.selectedAddress ?? "0x").padStart(64, "0"));
        setAddress(addr);
        //setChain(chainId())
        setConnected(!!wallet?.isConnected);
        if (wallet?.account) {
            setAccount(wallet.account);
        }
        if (wallet?.isConnected) {
            setChain(wallet.chainId);
            // shortString.decodeShortString(await wallet.provider.getChainId());
            setMyProvider(wallet.provider);
        }
        // setSupportsSessions(null)
        // if (wallet?.selectedAddress) {
        //   const sessionSupport = await supportsSessions(
        //     wallet.selectedAddress,
        //     wallet.provider,
        //   )
        //   console.log(
        //     "🚀 ~ file: index.tsx ~ line 72 ~ handleConnectClick ~ sessionSupport",
        //     sessionSupport,
        //   )
        //   setSupportsSessions(sessionSupport)
        // }
    }

    function IncreaseBalance() { }

    async function getBalance(account: AccountInterface): Promise<string> {
        const compiledTest = contratSierra;
        const myTestContract = new Contract(compiledTest.abi, ContractAddress, account);
        const balance = await myTestContract.get_balance({
            parseRequest: false,
            parseResponse: false,
        });
        console.log("balance =", balance);
        return BigInt(balance).toString(10);
    }


    return (
        <ChakraProvider>
            <div>

                <p className={styles.bgText}>
                    Test get-wallet-starknet with starknet.js v5.5.0
                    <br />
                    Connect to testnet
                </p>

                <div>
                    
                        {
                            !isConnected ? (
                                <Button
                                    ml="4"
                                    textDecoration="none !important"
                                    outline="none !important"
                                    boxShadow="none !important"
                                    onClick={() => {
                                        handleConnectClick();
                                    }}
                                >
                                    Connect Wallet
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        ml="4"
                                        textDecoration="none !important"
                                        outline="none !important"
                                        boxShadow="none !important"
                                        onClick={() => {
                                            setConnected(false);
                                        }}
                                    >
                                        {account
                                            ? `Your wallet : ${address?.slice(0, 7)}...${address?.slice(-4)} is connected`
                                            : "No Account"}
                                    </Button>
                                    <br />
                                    <p className={styles.text1}>
                                        address = {address}<br />
                                        chain = {chain}<br />
                                        isConnected={isConnected ? 1 : 0}<br />
                                        account.address ={account?.address}
                                    </p>
                                    <br />
                                    {myProvider &&
                                        <BlockDisplay providerSN={myProvider}></BlockDisplay>
                                    }

                                    <Button
                                        ml="4"
                                        textDecoration="none !important"
                                        outline="none !important"
                                        boxShadow="none !important"
                                        onClick={() => {
                                            IncreaseBalance();
                                        }}
                                    >
                                        Increase balance
                                    </Button>
                                    <br />
                                    {/* Balance = {getBalance(account!)} */}
                                </>
                            )
                        }
                   

                </div>


            </div >
        </ChakraProvider>
    )
}


