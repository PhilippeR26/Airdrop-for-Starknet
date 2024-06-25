import { WALLET_API } from "@starknet-io/types-js";
import { useEffect } from "react";
import { RpcProvider, WalletAccount, validateAndParseAddress } from "starknet";
import { useStoreWallet } from './walletContext';
import { myProviderUrl } from "@/app/utils/constants";

// Wallet is triggering events when user change network or account.
// This code is handling the subscriptions.
export function WalletEvents() {
    const setAddressAccount = useStoreWallet(state => state.setAddressAccount);
    const myWallet = useStoreWallet(state => state.walletSWO);
    const chainFromContext = useStoreWallet(state => state.chain);
    const setChain = useStoreWallet(state => state.setChain);
    const setMyWalletAccount = useStoreWallet(state => state.setMyWalletAccount);


    useEffect(
        () => {
            console.log("*****subscribe to events.");
            const handleAccount: WALLET_API.AccountChangeEventHandler = (accounts: string[] | undefined) => {
                console.log("****accounts change Event =", accounts);
                if (accounts?.length && myWallet) {
                    const textAddr = validateAndParseAddress(accounts[0])
                    setAddressAccount(textAddr);
                    setMyWalletAccount(new WalletAccount({ nodeUrl: myProviderUrl }, myWallet)); // zustand
                };
            };
            myWallet?.on("accountsChanged", handleAccount);

            const handleNetwork: WALLET_API.NetworkChangeEventHandler = (chainId?: string, accounts?: string[]) => {
                console.log("******network change subscription=", chainId);
                if (!!chainId) {
                    setChain(chainId); //zustand
                    console.log("change Provider index to", chainId);
                };
            }
            myWallet?.on("networkChanged", handleNetwork);
            return () => {
                console.log("unsubscribe to events.");
                if (!!myWallet) {
                    myWallet.off("accountsChanged", handleAccount);
                    console.log("events OFF");
                    myWallet.off('networkChanged', handleNetwork);
                }
            }
        },
        []
    );

    return (
        <>
        </>
    )
}