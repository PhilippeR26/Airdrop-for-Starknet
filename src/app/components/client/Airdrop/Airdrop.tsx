"use client";
import { AirdropAddress } from "@/app/utils/constants";
import { erc20Address, myProviderUrl, networkName } from "@/app/utils/constants";
import { useStoreWallet } from "../ConnectWallet/walletContext";
import { useEffect, useState } from "react";
import { Spinner, Text } from "@chakra-ui/react";
import { useStoreBlock } from "../Block/blockContext";
import { Contract, RpcProvider, constants, shortString } from "starknet";
import { airdropAbi } from "@/app/contracts/abis/airdropAbi";
import Claim from "./Claim";
import GetBalanceAirdrop from "../Contract/GetBalanceAirdrop";
import { WalletEvents } from "../ConnectWallet/WalletEvents";

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
    return chainId == shortString.encodeShortString(networkName);
  }


  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && !!addressAccountFromContext) {
        console.log("address airdropped?", addressAccountFromContext);
        const isAirdropped = await airdropContract.call("is_address_airdropped", [addressAccountFromContext]) as boolean;
        setIsAirdropped(isAirdropped);
        setIsCheckMade(true);
        console.log("isAirdropped, isAirdropProcessed:", isAirdropped, isAirdropProcessed);

      }
    }
    fetchData().catch(console.error);
  }
    , [isConnected, blockFromContext, addressAccountFromContext, chainId]);

  return (
    <>
      {!isConnected ? (
        <>
        </>
      ) : (
        <>
          <WalletEvents></WalletEvents>
          {!isValidNetwork() ? (
            <>
              <Text color="red">You are not in {networkName}. <br></br> Please select {networkName} network in your wallet.</Text>
            </>
          ) : (
            <>
              <GetBalanceAirdrop tokenAddress={erc20Address}></GetBalanceAirdrop>
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
