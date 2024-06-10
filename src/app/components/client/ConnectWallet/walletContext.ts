"use client";
import { create } from "zustand";
import { ProviderInterface, AccountInterface, constants, type WalletAccount} from "starknet";
import type { StarknetWindowObject } from 'get-starknet-core';


export interface WalletState {
    wallet: StarknetWindowObject | undefined,
    setMyWallet: (wallet: StarknetWindowObject|undefined) => void,
    addressAccount: string,
    setAddressAccount: (address: string) => void,
    chain: string,
    setChain: (chain: string) => void,
    account: AccountInterface | undefined,
    setAccount: (account: AccountInterface) => void,
    provider: ProviderInterface | undefined,
    setProvider: (provider: ProviderInterface) => void,
    myWalletAccount: WalletAccount|undefined;
    setMyWalletAccount: (myWAccount:WalletAccount)=>void;
    isConnected: boolean,
    setConnected: (isConnected: boolean) => void,
    displaySelectWalletUI: boolean,
    setSelectWalletUI: (displaySelectWalletUI: boolean) => void,
}

export const useStoreWallet = create<WalletState>()(set => ({
    wallet: undefined,
    setMyWallet: (wallet: StarknetWindowObject|undefined) => { set(state => ({ wallet: wallet })) },
    addressAccount: "",
    setAddressAccount: (address: string) => { set(state => ({ addressAccount: address })) },
    chain: constants.StarknetChainId.SN_SEPOLIA,
    setChain: (chain: string) => { set(state => ({ chain: chain })) },
    account: undefined,
    setAccount: (account: AccountInterface) => { set(state => ({ account })) },
    provider: undefined,
    setProvider: (provider: ProviderInterface) => { set(state => ({ provider: provider })) },
    myWalletAccount: undefined,
    setMyWalletAccount: (myWAccount: WalletAccount) => { set(state => ({ myWalletAccount: myWAccount })) },
    isConnected: false,
    setConnected: (isConnected: boolean) => { set(state => ({ isConnected })) },
    displaySelectWalletUI: false,
    setSelectWalletUI: (displaySelectWalletUI: boolean) => { set(state => ({ displaySelectWalletUI })) },
}));
