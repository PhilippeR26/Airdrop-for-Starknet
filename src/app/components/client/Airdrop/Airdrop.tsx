"use client";
import { AirdropAddress, erc20Address, myProviderUrl } from "@/app/utils/constants";
import { useStoreWallet } from "../ConnectWallet/walletContext";
import GetBalance from "../Contract/GetBalance";
import { useEffect, useState } from "react";
import { Spinner, Text } from "@chakra-ui/react";
import { useStoreBlock } from "../Block/blockContext";
import { Contract, RpcProvider, constants } from "starknet";
import { airdropAbi } from "@/app/contracts/abis/airdropAbi";
import Claim from "./Claim";

export default function Airdrop() {
  const isConnected = useStoreWallet(state => state.isConnected);
  const [isAirdropProcessed, setIsAirdropProcessed] = useState<Boolean>(false);
  const [isAirdropped, setIsAirdropped] = useState<Boolean>(false);
  const [isEligible, setIsEligible] = useState<Boolean>(false);
  const [isCheckMade, setIsCheckMade] = useState<Boolean>(false);
  const [airdropContract] = useState<Contract>(new Contract(airdropAbi, AirdropAddress, new RpcProvider({ nodeUrl: myProviderUrl })));
  const addressAccountFromContext = useStoreWallet(state => state.addressAccount);
  const blockFromContext = useStoreBlock(state => state.dataBlock);
  const chainId = useStoreWallet(state => state.chain);

  function isValidNetwork(): boolean {
    return chainId==constants.StarknetChainId.SN_MAIN; // devnet
  }


  useEffect(() => {
    const fetchData = async () => {
      if (isConnected) {
        console.log("address airdropped?", addressAccountFromContext);
        const isAirdropped = await airdropContract.call("is_address_airdropped", [addressAccountFromContext]) as boolean;
        setIsAirdropped(isAirdropped);
        setIsCheckMade(true);
        console.log("check Airdropped:", isAirdropped, isAirdropProcessed);

      }
    }
    fetchData().catch(console.error);
  }
    , [isConnected, blockFromContext]);

  return (
    <>
      {!isConnected ? (
        <>
        </>
      ) : (
        <>
          {!isValidNetwork() ? (
            <>
            <Text color="red">You are not in Mainnet. <br></br> Please unconnect / reconnect with a wallet configured to Mainnet.</Text>
            </>
          ) : (
            <>
              <GetBalance tokenAddress={erc20Address}></GetBalance>
              {!isAirdropProcessed ? (
                <>
                  {!isCheckMade ? (
                    <>
                      <Spinner color="blue" size="sm" mr={4} />  Fetching data ...
                    </>
                  ) : (
                    <>
                      {isAirdropped ? (
                        <>
                          You have been awarded for this airdrop.
                        </>
                      ) : (
                        <>
                        {isAirdropped}
                          <Claim></Claim>
                        </>
                      )}
                    </>
                  )
                  }
                </>
              ) : (
                <>
                
                </>
              )
              }
            </>
          )}
        </>
      )}
    </>
  )
}
