"use client";
import { create } from "zustand";
import { ProviderInterface, AccountInterface } from "starknet";
import { StarknetWindowObject } from "get-starknet";

export interface WalletState {
    wallet: StarknetWindowObject | undefined,
    setMyWallet: (wallet: StarknetWindowObject) => void,
    addressAccount: string,
    setAddressAccount: (address: string) => void,
    chain: string,
    setChain: (chain: string) => void,
    account: AccountInterface | undefined,
    setAccount: (account: AccountInterface) => void,
    provider: ProviderInterface | undefined,
    setProvider: (provider: ProviderInterface) => void,
    isConnected: boolean,
    setConnected: (isConnected: boolean) => void,
    displaySelectWalletUI: boolean,
    setSelectWalletUI: (displaySelectWalletUI: boolean) => void,
}

export const useStoreWallet = create<WalletState>()(set => ({
    wallet: undefined,
    setMyWallet: (wallet: StarknetWindowObject) => { set(state => ({ wallet: wallet })) },
    addressAccount: "",
    setAddressAccount: (address: string) => { set(state => ({ addressAccount: address })) },
    chain: " ",
    setChain: (chain: string) => { set(state => ({ chain: chain })) },
    account: undefined,
    setAccount: (account: AccountInterface) => { set(state => ({ account })) },
    provider: undefined,
    setProvider: (provider: ProviderInterface) => { set(state => ({ provider: provider })) },
    isConnected: false,
    setConnected: (isConnected: boolean) => { set(state => ({ isConnected })) },
    displaySelectWalletUI: false,
    setSelectWalletUI: (displaySelectWalletUI: boolean) => { set(state => ({ displaySelectWalletUI })) },
}));
