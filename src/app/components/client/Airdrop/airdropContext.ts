"use client";
import { create } from "zustand";

export interface AirdropState {
    isAirdropSuccess: boolean,
    setIsAirdropSuccess:(isAirdropSuccess:boolean) =>void,
}

export const useStoreAirdrop = create<AirdropState>()(set => ({
    isAirdropSuccess:false ,
    setIsAirdropSuccess:(isAirdropSuccess:boolean)=>{set(state=>({isAirdropSuccess}))}
}));
