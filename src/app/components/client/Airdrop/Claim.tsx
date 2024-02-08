import { useEffect, useState } from "react"
import { Button, Spinner } from "@chakra-ui/react";
import Prides from "react-canvas-confetti/dist/presets/pride";
import * as Merkle from "starknet-merkle-tree";
import { Account, CallData, Contract, RpcProvider } from "starknet";

import { useStoreWallet } from "../ConnectWallet/walletContext";
import { checkWhitelist } from "@/app/server/airdropServer";
import { ProofAnswer } from "@/interfaces";
import { airdropAbi } from "@/app/contracts/abis/airdropAbi";
import { AirdropAddress, myProviderUrl } from "@/app/utils/constants";
import { useStoreBlock } from "../Block/blockContext";
import { useStoreAirdrop } from "./airdropContext";
import { AddInvokeTransactionParameters } from "../ConnectWallet/core/rpcMessage";


export default function Airdrop() {
  const myWallet = useStoreWallet(state => state.wallet);
  const [isEligible, setIsEligible] = useState<Boolean>(false);
  const [isConsoled, setIsConsoled] = useState<Boolean>(true);
  const [availableConsolation, setAvailableConsolation] = useState<bigint>(10000n);
  const blockFromContext = useStoreBlock(state => state.dataBlock);
  const [isChecked, setIsChecked] = useState<Boolean>(false);
  const [isProcessStarted, setIsProcessStarted] = useState<Boolean>(false);
  //const [isSuccess, setIsSuccess] = useState<Boolean>(false);
  const isAirdropSuccess = useStoreAirdrop((state) => state.isAirdropSuccess);
  const setIsAirdropSuccess = useStoreAirdrop((state) => state.setIsAirdropSuccess);

  const [isError, setIsError] = useState<Boolean>(false);
  const [amount, setAmount] = useState<bigint>(0n);
  const [proof, setProof] = useState<string[]>([]);
  const [leaf, setLeaf] = useState<Merkle.InputForMerkle>([]);
  const [leafHash, setLeafHash] = useState<string>("");
  const isConnected = useStoreWallet(state => state.isConnected);
  const addressAccountFromContext = useStoreWallet(state => state.addressAccount);
  const [myProvider] = useState<RpcProvider>(new RpcProvider({ nodeUrl: myProviderUrl }));
  const [airdropContract] = useState<Contract>(new Contract(airdropAbi, AirdropAddress, new RpcProvider({ nodeUrl: myProviderUrl })));
  // const account = useStoreWallet(state => state.account); // no devnet
  // const [account] = useState<Account>(new Account(new RpcProvider({ nodeUrl: myProviderUrl }), addressAccountFromContext, devnetPk)); //devnet
  const accountAddress = useStoreWallet(state => state.addressAccount);
  const claimAirdrop = async () => {
    setIsProcessStarted(true);
    try {
      //const resp = await account!.execute(claimCall, undefined, {});
      const claimCall = airdropContract.populate("claim_airdrop", {
        amount: amount,
        proof: proof,
      });
      const myParams: AddInvokeTransactionParameters = {
        calls: [{
          contract_address: claimCall.contractAddress,
          entrypoint: claimCall.entrypoint,
          calldata: claimCall.calldata as string[]
        }]
      }
      const resp = await myWallet!.request({ type: "starknet_addInvokeTransaction", params: myParams });
      const txR = await myProvider.waitForTransaction(resp.transaction_hash);
      if (txR.execution_status == "SUCCEEDED") {
        setIsError(false);
        setIsAirdropSuccess(true);
      } else {
        setIsAirdropSuccess(false);
        setIsError(true);
      }
    } catch (err) {
      console.log("Claim invocation failed :", err);
      setIsAirdropSuccess(false);
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
      // const resp = await account!.execute(claimCall, undefined, {});
      const claimCall = airdropContract.populate("claim_airdrop", {
        amount: 1,
        proof: [0],
      });
      const myParams: AddInvokeTransactionParameters = {
        calls: [{
          contract_address: claimCall.contractAddress,
          entrypoint: claimCall.entrypoint,
          calldata: claimCall.calldata as string[]
        }]
      }
      const resp = await myWallet!.request({ type: "starknet_addInvokeTransaction", params: myParams });
      const txR = await myProvider.waitForTransaction(resp.transaction_hash);
      if (txR.execution_status == "SUCCEEDED") {
        setIsError(false);
        setIsAirdropSuccess(true);
      } else {
        setIsAirdropSuccess(false);
        setIsError(true);
      }
    } catch (err) {
      console.log("Claim invocation failed :", err);
      setIsAirdropSuccess(false);
      setIsError(true);
    }

  }

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && addressAccountFromContext) {
        // ask to server 
        const whiteListAnswer: ProofAnswer = await checkWhitelist(addressAccountFromContext);
        setIsEligible(whiteListAnswer.isWhiteListed);
        console.log("address in whitelist?", addressAccountFromContext, whiteListAnswer.isWhiteListed);

        setAmount(whiteListAnswer.amount);
        setProof(whiteListAnswer.proof);
        setLeaf(whiteListAnswer.leaf);
        setLeafHash(whiteListAnswer.leafHash);
        setIsChecked(true);
        const isConsol = await airdropContract.call("is_address_consoled", [addressAccountFromContext]) as boolean;
        setIsConsoled(isConsol);
      }
    }
    fetchData().catch(console.error);
  }
    , [isConnected, addressAccountFromContext]);

  useEffect(() => {
    const fetchIsConsoled = async () => {
      if (isConnected && addressAccountFromContext) {
        const isConsol = await airdropContract.call("is_address_consoled", [addressAccountFromContext]) as boolean;
        console.log("isConsoled", isConsol);
        const remainingConsolation = await airdropContract.call("remaining_consolation", []) as bigint;
        setAvailableConsolation(remainingConsolation);
      }
      fetchIsConsoled().catch(console.error);
    }
  }
    , [isConnected, addressAccountFromContext, blockFromContext]);

  return (
    <>
      {!isChecked ? (<>
        <Spinner color="blue" size="sm" mr={4} />  Fetching data ...
      </>) : (<>
        {!isEligible ? (
          <>
            {isProcessStarted ? (<>
              {!isAirdropSuccess && !isError && (<> <Spinner color="blue" size="sm" mr={4} />  Processing reward ... </>)}
              {isAirdropSuccess ? (<>
                Consolation prize successfully processed.
                Do not forget to configure your wallet to display this token.
                <Prides autorun={{ speed: 5 }} />
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
                  {availableConsolation > 0n ? (<>
                    <Button
                      colorScheme='green'
                      ml="4"
                      marginTop={1}
                      marginBottom={1}
                      onClick={claimConsolation}
                    >
                      Claim a consolation prize
                    </Button>
                  </>) : (<>
                    Too late! No more consolation prize available.
                  </>)}
                </>
              )}

            </>)}
          </>
        ) : (  // eligible
          <>
            {isProcessStarted ? (<>
              {!isAirdropSuccess && !isError && (<> <Spinner color="blue" size="sm" mr={4} />  Processing claim ... </>)}
              {isAirdropSuccess ? (<>
                Claim successfully processed. <br></br>
                Do not forget to configure your wallet to display this token.
                <Prides autorun={{ speed: 5 }} />
              </>) : (<>
                {isError && (<>
                  Processing has failed.
                </>)}
              </>)}
            </>) : (<>
              {isConsoled ? (<>
                You should be awarded, but you already received a consolation prize.
              </>) : (<>
                You are eligible for this airdrop <br></br>
                <Button
                  colorScheme='green'
                  ml="4"
                  marginTop={1}
                  marginBottom={1}
                  onClick={claimAirdrop}
                >
                  Claim {amount.toString()} SJS6 token
                </Button>
              </>)}
            </>
            )}
          </>
        )}
      </>)}
    </>
  )
}