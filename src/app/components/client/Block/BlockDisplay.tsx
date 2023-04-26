import { use, useEffect, useMemo, useState } from 'react';
import { Provider, ProviderInterface, RpcProvider, constants, GetBlockResponse } from "starknet";
import { useStoreBlock, DataBlock, dataBlockInit } from "./blockContext";
import { Text, Button } from "@chakra-ui/react";
import styles from '../../../page.module.css'


type Props = { providerSN: ProviderInterface };

export default function BlockDisplay({ providerSN }: Props) {
    const blockFromContext = useStoreBlock(state => state.dataBlock);
    const setBlockData = useStoreBlock((state) => state.setBlockData);
    // const [blockData, setBlockData] = useState<DataBlock>({
    //     timeStamp: 0,
    //     blockHash: "",
    //     blockNumber: 0,
    //     gasPrice: ""
    // });
    const [timerId, setTimerId] = useState<NodeJS.Timer | undefined>(undefined);
    // useEffect(() => { setBlockNumber(blockFromContext.blockNumber) }, [blockFromContext.blockNumber]);

    // useEffect(() => { { startTimerBlock(providerSN, 8000); console.log("useeffect startblocktimer") }; return () => { stopBlockTimer(); console.log("stopTimer") } }, [])

    // const myProvider = new RpcProvider({ nodeUrl: 'http://192.168.1.99:9545' });
    const myProvider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });

    // management of 
    useEffect(() => {
        const tim = setInterval(() => {
            myProvider.getBlock("latest").then((resp: GetBlockResponse) => {
                setBlockData({
                    timeStamp: resp.timestamp,
                    blockHash: resp.block_hash,
                    blockNumber: resp.block_number,
                    gasPrice: resp.gas_price ?? ""
                }
                )
            })
                .catch((e) => { console.log("error getBloc=", e) })
            // setBlockNumber(num => num + 1);
            console.log("timerId=", tim);
        }
            , 5000 //ms
        );
        setTimerId(() => tim);

        console.log("startTimer", tim);

        return () => {
            clearInterval(tim);
            console.log("stopTimer", tim)
        }
    }
        , []);

    // useEffect(() => {

    // }
    //     , []
    // );


    return (
        <>
            {
                !blockFromContext.blockNumber ? (
                    <Text>Fetching in progres ... </Text>

                ) : (
                    <>
                        <Text className={styles.text1}>BlockNumber = {blockFromContext.blockNumber} timerId = {timerId ? "Set" : "Not set"} </Text>
                        <Text className={styles.text1}>BlockHash = {blockFromContext.blockHash}  </Text>
                        <Text className={styles.text1}>BlockTimeStamp = {blockFromContext.timeStamp}  </Text>
                        <Text className={styles.text1}>BlockGasprice = {blockFromContext.gasPrice}  </Text>
                        {/* <Button onClick={() => {
                            ;
                        }}>Increase</Button> */}
                    </>
                )}

        </>

    )
}