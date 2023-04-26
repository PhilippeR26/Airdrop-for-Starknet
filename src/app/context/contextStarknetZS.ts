"use client";

// contextStarknetZS.ts
// definition of Zustand storage of Parent page, for Starknet variables
import { AccountInterface, defaultProvider, Provider, ProviderInterface, SequencerProvider, constants } from "starknet";
import { create } from 'zustand'
import { connect } from "get-wallet-starknet";
// import { toast } from "material-react-toastify";
import { DEVNET } from "../contracts/addresses";

// global starknet vars of Parent page, without save 

export interface StarknetState {
    account?: AccountInterface;
    connected: boolean;
    connectBrowserWallet: () => void;
    setConnected: (con: boolean) => void;
    provider?: Provider;
}

// definition of starknet tmp storage for Parent page
export const useStoreStarknetTmp = create<StarknetState>()(set => ({
    account: undefined,
    connected: false,
    provider: undefined,
    connectBrowserWallet: async () => {
        try {
            const starknet = await connect({ modalMode: "alwaysAsk", modalTheme: "dark" }); // Let the user pick a wallet
            console.log("P1");
            if (!starknet) return;
            console.log("P2");
            await starknet.enable(); // connect the wallet
            console.log("P3");
            console.log("addr1 =",starknet.selectedAddress);
            if (
                starknet.isConnected &&
                starknet.provider &&
                starknet.account.address
            ) {
                const net: constants.StarknetChainId = await starknet.provider.getChainId();
                console.log("wallet type =",starknet.name);
                console.log("wallet network =",net);
                console.log("wallet addr =",starknet.account.address);
                // const aaa:AccountInterface=starknet.account;
                set(state => ({ account: starknet.account }));
                set(state => ({ connected: true }));
                DEVNET ?
                    set(state => ({ provider: new Provider({ sequencer: { baseUrl: "http://127.0.0.1:5050" } }) }))
                    : () => {
                        set(state => ({
                            provider: new Provider({ sequencer: { network: net } })
                        }));
                    }
            }
        } catch (e) {
            // toast.error("⚠️ Wallet extension missing!", {
            //     position: "top-left",
            //     autoClose: 5000,
            //     hideProgressBar: true,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            // });
        }
    },
    setConnected: (con: boolean) => {
        set(state => ({ connected: con }));
        if (!con) {
            set(state => ({ account: undefined }));
            set(state => ({ provider: defaultProvider }));
        }
    },
}));
