"use client";
import { create } from "zustand";

export interface DataBlock {
    blockNumber: number
}

export const dataBlockInit:DataBlock={
    blockNumber: 0
}

export interface BlockState {
    dataBlock: DataBlock,
    setBlockData:(blockInfo:DataBlock) =>void,
}

export const useStoreBlock = create<BlockState>()(set => ({
    dataBlock:dataBlockInit ,
    setBlockData:(blockInfo:DataBlock)=>{set(state=>({dataBlock:blockInfo}))}
}));
