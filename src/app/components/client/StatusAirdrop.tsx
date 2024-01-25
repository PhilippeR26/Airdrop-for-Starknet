"use client";
import { Box, Center, Divider, Link } from "@chakra-ui/react";
import { useStoreBlock } from "./Block/blockContext";
import { useEffect, useState } from "react";
import { airdropAbi } from "@/app/contracts/abis/airdropAbi";
import { AirdropAddress, erc20Address, myProviderUrl } from "@/app/utils/constants";
import { Contract, RpcProvider } from "starknet";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function StatusAirdrop() {

  const blockFromContext = useStoreBlock(state => state.dataBlock);
  const [airdropContract] = useState<Contract>(new Contract(airdropAbi, AirdropAddress, new RpcProvider({ nodeUrl: myProviderUrl })));
  const [qtyAirdrop, setQtyAirdrop] = useState<bigint>(0n);
  const [qtyConsolationRemaining, setQtyConsolationRemaining] = useState<bigint>(0n);

  const fetchData = async () => {
    const qty_airdrop = await airdropContract.call("qty_airdropped") as bigint;
    setQtyAirdrop(qty_airdrop);
    const qty_consolation_remaining = await airdropContract.call("remaining_consolation") as bigint;
    setQtyConsolationRemaining(qty_consolation_remaining);
  }
  useEffect(() => {
    fetchData().catch(console.error);
  }
    , []);
  useEffect(() => {
    fetchData().catch(console.error);
  }
    , [blockFromContext.blockNumber]);
  return <Center>
    <Box
      marginTop="1"
      marginBottom="5"
      w="80vw"
      borderRadius="xl"
      bg='pink'
      opacity="70%"
      p="2"
      textAlign={'center'}
      fontSize="18"
      fontWeight="bold"
      color="red.800"
    >
      Token address = <Link href={'https://goerli.voyager.online/token/' + erc20Address} isExternal>
        {erc20Address} <ExternalLinkIcon mx='2px' />
      </Link> <br></br>
      <Divider borderColor='gray.800' />
      40 000 tokens are reserved to a list of 1 400 highly active addresses. <br></br>
      10 000 tokens are reserved for the fastest non white listed addresses.<br></br>
      <Divider borderColor='gray.800' />
      {qtyAirdrop.toString()} tokens are already airdropped from the white list.<br></br>
      {qtyConsolationRemaining.toString()} tokens are remaining as consolation prizes.
    </Box>
  </Center>
}
