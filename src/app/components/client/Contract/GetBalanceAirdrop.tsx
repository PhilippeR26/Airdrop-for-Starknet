"use client";

import { useEffect, useState } from 'react';
import { Text, Center, Spinner, } from "@chakra-ui/react";
import styles from '../../../page.module.css'

import { Contract, uint256, shortString, RpcProvider } from "starknet";

import { useStoreBlock } from "../Block/blockContext";
import { useStoreWallet } from '../ConnectWallet/walletContext';


import { erc20Abi } from '../../../contracts/abis/ERC20abi';
import {  myProviderUrl } from '@/app/utils/constants';
import { formatBalance } from '@/app/utils/formatBalance';
import { useStoreAirdrop } from '../Airdrop/airdropContext';

type Props = { tokenAddress: string };

export default function GetBalance({ tokenAddress }: Props) {
    // block context
    const blockFromContext = useStoreBlock(state => state.dataBlock);
    const accountAddress = useStoreWallet((state) => state.addressAccount);
    const isAirdropSuccess = useStoreAirdrop((state) => state.isAirdropSuccess);
    const setIsAirdropSuccess = useStoreAirdrop((state) => state.setIsAirdropSuccess);
    
    const [balance, setBalance] = useState<bigint | undefined>(undefined);
    const [decimals, setDecimals] = useState<number>(18)
    const [symbol, setSymbol] = useState<string>("");

    const [erc20Contract] = useState<Contract>(new Contract(erc20Abi, tokenAddress, new RpcProvider({ nodeUrl: myProviderUrl })));

    useEffect(() => {
        const fetchData = async () => {
            setIsAirdropSuccess(false);
            const resp1 = await erc20Contract.call("decimals") ;
            console.log("addr ERC20=",erc20Contract.address);
            console.log("resDecimals=", resp1);
            setDecimals(Number(resp1));

            const resp2 = await erc20Contract.call("symbol") as bigint;
            const res2 = shortString.decodeShortString(resp2.toString());
            console.log("Symbol=", res2);
            setSymbol(res2);
        }

        fetchData().catch(console.error);
    }
        , []);

    useEffect(() => {
        const fetchData = async () => {
            const resp3 = await erc20Contract.call("balanceOf", [accountAddress]) as bigint;
            console.log("balance=", resp3);
            setBalance(resp3);
        }
        fetchData().catch(console.error);
    }
        , [blockFromContext.blockNumber, decimals, isAirdropSuccess]); // balance updated at each block

    return (
        <>
            {
                typeof (balance) !== "bigint" ? (
                    <>
                        <Center>
                            <Spinner color="blue" size="sm" mr={4} />  Fetching data ...
                        </Center>
                    </>
                ) : (
                    <>
                        <Text className={styles.text1}>Balance = {balance.toString()} {symbol} </Text>
                    </>
                )
            }
        </>
    )
}