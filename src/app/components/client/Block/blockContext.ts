"use client";
import { create } from "zustand";
import { GetBlockResponse, Provider,RpcProvider, ProviderInterface } from "starknet";

export interface DataBlock {
    timeStamp: number,
    blockHash: string,
    blockNumber: number,
    gasPrice: string,
}

export const dataBlockInit:DataBlock={
    timeStamp: 0,
    blockHash: "",
    blockNumber: 0,
    gasPrice: "",
}

export interface BlockState {
    dataBlock: DataBlock,
    setBlockData:(blockInfo:DataBlock) =>void,
    // timerID: NodeJS.Timer | undefined,
    // startTimerBlock: (provider: ProviderInterface, interv?: number) => void,
    // stopTimerBlock: () => void,
}

export const useStoreBlock = create<BlockState>()(set => ({
    dataBlock:dataBlockInit ,
    setBlockData:(blockInfo:DataBlock)=>{set(state=>({dataBlock:blockInfo}))}
    // timerID: undefined,
    // startTimerBlock: (provider: ProviderInterface, interv: number=5000) => {
    //     const tim = setInterval(function () {
    //         const myP=new RpcProvider({ nodeUrl: 'http://192.168.1.99:9545' });;
    //         provider.getBlock("latest").then((resp: GetBlockResponse) => {
    //             set(state => ({
    //                 dataBlock: {
    //                     timeStamp: resp.timestamp,
    //                     blockHash: resp.block_hash,
    //                     blockNumber: resp.block_number,
    //                     gasPrice: resp.gas_price ?? "",
    //                 }
    //             }));
    //             console.log("bloc =",get().dataBlock.blockNumber,", interv=",interv,", timerId=",get().timerID);
    //         })
    //         .catch((e)=>{console.log("error getBloc=",e)})
    //         ,
    //             interv //ms
    //     });
    //     set(state => ({ timerID: tim }));
    // },
    // stopTimerBlock: () => clearInterval(get().timerID)
}));
