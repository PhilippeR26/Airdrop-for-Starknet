"use client";
import { AirdropAddress, erc20Address, myProviderUrl } from "@/app/utils/constants";
import { useStoreWallet } from "../ConnectWallet/walletContext";
import GetBalance from "../Contract/GetBalance";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { useStoreBlock } from "../Block/blockContext";
import { Contract, RpcProvider } from "starknet";
import { airdropAbi } from "@/app/contracts/abis/airdropAbi";

export default function Airdrop() {
  const isConnected = useStoreWallet(state => state.isConnected);
  const [isAirdropProcessed, setIsAirdropProcessed] = useState<Boolean>(false);
  const [isCheckMade, setIsCheckMade] = useState<Boolean>(false);

  useEffect(() => {
    // const blockFromContext = useStoreBlock(state => state.dataBlock);
    // const [airdropContract] = useState<Contract>(new Contract(airdropAbi, AirdropAddress, new RpcProvider({ nodeUrl: myProviderUrl })));

     const fetchData = async () => {

    //     const resp1 = await erc20Contract.call("decimals") ;
    //     console.log("addr ERC20=",erc20Contract.address);
    //     console.log("resDecimals=", resp1);
    //     setDecimals(Number(resp1));

    //     const resp2 = await erc20Contract.call("symbol") as bigint;
    //     console.log("resp2=",resp2);
    //     const res2 = shortString.decodeShortString(resp2.toString());
    //     console.log("resSymbol=", res2);
    //     setSymbol(res2);
    }
    fetchData().catch(console.error);
}
    , []);

  return (
    <>
      {!isConnected ? (
        <>
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
      )
      }
    </>
  )
}