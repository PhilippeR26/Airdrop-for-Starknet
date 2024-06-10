"use client";
import { useEffect, useState } from 'react';
import { ProviderInterface, type GetBlockResponse, RpcProvider } from "starknet";
import { useStoreBlock } from "./blockContext";
import { Text, Divider } from "@chakra-ui/react";
import styles from '../../../page.module.css'

type Props = { providerUrl: string };

export default function BlockSurvey({ providerUrl }: Props) {
    const blockFromContext = useStoreBlock(state => state.dataBlock);
    const setBlockData = useStoreBlock((state) => state.setBlockData);
    const [timerId, setTimerId] = useState<NodeJS.Timer | undefined>(undefined);
    const [FrontendProvider] = useState<RpcProvider>(new RpcProvider({ nodeUrl: providerUrl }));

    useEffect(() => {
        const tim = setInterval(() => {
            FrontendProvider.getBlockNumber()
                .then((resp: number) => {
                    setBlockData({
                        blockNumber: resp
                    })
                })
                .catch((e) => { console.log("error getBlocNumber=", e) })
            console.log("timerId=", tim);
        }
            , 10_000 //ms
        );
        setTimerId(() => tim);

        console.log("startTimer", tim);

        return () => {
            clearInterval(tim);
            console.log("stopTimer", tim)
        }
    }
        , []);

    return (
        <>

        </>

    )
}