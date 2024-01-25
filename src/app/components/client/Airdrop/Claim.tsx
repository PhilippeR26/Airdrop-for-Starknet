import { useEffect, useState } from "react"
import { useStoreWallet } from "../ConnectWallet/walletContext";
import { Button, Spinner } from "@chakra-ui/react";
import { checkWhitelist } from "@/app/server/airdropServer";
import { ProofAnswer } from "@/interfaces";
import * as Merkle from "starknet-merkle-tree";
import { airdropAbi } from "@/app/contracts/abis/airdropAbi";
import { AirdropAddress, devnetPk, myProviderUrl } from "@/app/utils/constants";
import { Account, Contract, RpcProvider } from "starknet";
import { useStoreBlock } from "../Block/blockContext";


export default function Airdrop() {
  const [isEligible, setIsEligible] = useState<Boolean>(false);
  const [isConsoled, setIsConsoled] = useState<Boolean>(true);
  const blockFromContext = useStoreBlock(state => state.dataBlock);
  const [isChecked, setIsChecked] = useState<Boolean>(false);
  const [isProcessStarted, setIsProcessStarted] = useState<Boolean>(false);
  const [isSuccess, setIsSuccess] = useState<Boolean>(false);
  const [isError, setIsError] = useState<Boolean>(false);
  const [amount, setAmount] = useState<bigint>(0n);
  const [proof, setProof] = useState<string[]>([]);
  const [leaf, setLeaf] = useState<Merkle.InputForMerkle>([]);
  const [leafHash, setLeafHash] = useState<string>("");
  const isConnected = useStoreWallet(state => state.isConnected);
  const addressAccountFromContext = useStoreWallet(state => state.addressAccount);
  const [myProvider] = useState<RpcProvider>(new RpcProvider({ nodeUrl: myProviderUrl }));
  const [airdropContract] = useState<Contract>(new Contract(airdropAbi, AirdropAddress, new RpcProvider({ nodeUrl: myProviderUrl })));
  const [account] = useState<Account>(new Account(new RpcProvider({ nodeUrl: myProviderUrl }), addressAccountFromContext, devnetPk));
  const claim = async () => {
    setIsProcessStarted(true);
    const claimCall = airdropContract.populate("claim_airdrop", {
      amount: amount,
      proof: proof,
    })
    try {
      const resp = await account.execute(claimCall, undefined, {});
      const txR = await myProvider.waitForTransaction(resp.transaction_hash);
      if (txR.execution_status == "SUCCEEDED") {
        setIsError(false);
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        setIsError(true);
      }
    } catch (err) {
      console.log("Claim invocation failed :", err);
      setIsSuccess(false);
      setIsError(true);
    }

  }

  const claimConsolation = async () => {
    setIsProcessStarted(true);
    const claimCall = airdropContract.populate("claim_airdrop", {
      amount: 0,
      proof: ["0x00"],
    })
    try {
      const resp = await account.execute(claimCall, undefined, {});
      const txR = await myProvider.waitForTransaction(resp.transaction_hash);
      if (txR.execution_status == "SUCCEEDED") {
        setIsError(false);
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        setIsError(true);
      }
    } catch (err) {
      console.log("Claim invocation failed :", err);
      setIsSuccess(false);
      setIsError(true);
    }

  }

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected) {
        console.log("address in whitelist?", addressAccountFromContext);
        // ask to server 
        const whiteListAnswer: ProofAnswer = await checkWhitelist(addressAccountFromContext);
        setIsEligible(whiteListAnswer.isWhiteListed);
        setAmount(whiteListAnswer.amount);
        setProof(whiteListAnswer.proof);
        setLeaf(whiteListAnswer.leaf);
        setLeafHash(whiteListAnswer.leafHash);
        setIsChecked(true);
      }
    }
    fetchData().catch(console.error);
  }
    , [isConnected]);

  useEffect(() => {
    const fetchIsConsoled = async () => {
      const isConsol = await airdropContract.call("is_address_consoled",[addressAccountFromContext]) as boolean;
      console.log("isConsoled", isConsol);
      setIsConsoled(isConsol);
    }
    fetchIsConsoled().catch(console.error);
  }
    , [isConnected, blockFromContext]);

  return (
    <>
      {!isChecked ? (<>
        <Spinner color="blue" size="sm" mr={4} />  Fetching data ...
      </>) : (<>
        {!isEligible ? (
          <>
            {isProcessStarted ? (<>
              {!isSuccess && !isError && (<> <Spinner color="blue" size="sm" mr={4} />  Processing reward ... </>)}
              {isSuccess ? (<>
                Consolation prize successfully processed.
              </>) : (<>
                {isError && (<>
                  Processing has failed.
                </>)}
              </>)}
            </>) : (<>
              You are NOT eligible for this airdrop. <br></br>
              {isConsoled ? (
                <>
                  You have received a consolation prize.<br></br>
                  Do not forget to configure your wallet to display this token.
                </>
              ) : (
                <>
                  <Button
                    colorScheme='green'
                    ml="4"
                    marginTop={1}
                    marginBottom={1}
                    onClick={claimConsolation}
                  >
                    Claim a consolation prize
                  </Button>
                </>
              )}

            </>)}
          </>
        ) : (  // eligible
          <>
            {isProcessStarted ? (<>
              {!isSuccess && !isError && (<> <Spinner color="blue" size="sm" mr={4} />  Processing claim ... </>)}
              {isSuccess ? (<>
                Claim successfully processed. <br></br>
                Do not forget to configure your wallet to display this token.
              </>) : (<>
                {isError && (<>
                  Processing has failed.
                </>)}
              </>)}
            </>) : (<>
              You are eligible for this airdrop <br></br>
              <Button
                colorScheme='green'
                ml="4"
                marginTop={1}
                marginBottom={1}
                onClick={claim}
              >
                Claim {amount.toString()} SJS6 token
              </Button>
            </>
            )}
          </>
        )}
      </>)}
    </>
  )
}