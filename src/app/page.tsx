"use server";
import NextImage from 'next/image'
import styles from './page.module.css'
import { Center, Spinner, Text, Button, ChakraProvider, Box, Link } from '@chakra-ui/react';
import Image from 'next/image'

import ClientComponent from './components/client/ClientComponent';
import airdropImg from './Images/airdrop-for-Starknet.jpg'
import { use } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import StatusAirdrop from './components/client/StatusAirdrop';
import ConnectWallet from './components/client/ConnectWallet/ConnectWallet';
import BlockSurvey from './components/client/Block/BlockSurvey';
import { myProviderUrl as FrontEndProviderUrl } from './utils/constants';
import Airdrop from './components/client/Airdrop/Airdrop';
import LowerBanner from './components/client/LowerBanner';
import starknetjsImg from "./Images/StarkNet-JS_logo.png";
import InitialDisclaimer from './components/client/InitialDisclaimer';


export default async function Page() {
  // const data1 =  fetchProof("0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a");
  // const data2=use(data1);
  // console.log("data1 =", data1);
  return (
    <ChakraProvider>
      <InitialDisclaimer></InitialDisclaimer>
      <div>
        <div className={styles.bgWrap}>
          <NextImage
            alt="Airdrop"
            src={airdropImg}
            fill
            placeholder="blur"
            quality={100}
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <Center p="2" >
          <Image src={starknetjsImg} alt='starknet.js' width={150}  />
        </Center>
        <Center>
          <Box
            marginTop={2}
            marginBottom={7}
            w="480px" 
            borderRadius={25}
            bg='pink.300'
            opacity="80%"
            p="2"
            textAlign={'center'}
            fontSize="28"
            fontWeight="extrabold"
            color="red.700"
          >
            STARKNET.JS V6 CELEBRATION<br></br>
            'SJS6' TOKEN AIRDROP
          </Box>
        </Center>
        <StatusAirdrop></StatusAirdrop>
        <BlockSurvey providerUrl={FrontEndProviderUrl}></BlockSurvey>
        <Center>
          <Box
            marginTop="1"
            marginBottom="5"
            w="70vw"
            borderRadius="xl"
            bg='pink'
            opacity="90%"
            p="2"
            textAlign={'center'}
            fontSize="18"
            fontWeight="bold"
            color="red.800"
          >
            <ConnectWallet></ConnectWallet>
            <Airdrop></Airdrop>
          </Box>
        </Center>
        <Center>
          <Box
            marginTop="1"
            marginBottom="5"
            borderColor="red"
            borderWidth="3px"
            borderRadius="xl"
            bg='yellow.200'
            opacity="80%"
            p="2"
            textAlign={'center'}
            fontSize="24"
            fontWeight="extrabold"
            color="red"
          >
            The repo of this airdrop DAPP is available
            <Link color="blue.700" href='https://github.com/PhilippeR26/Airdrop-for-Starknet' isExternal> here</Link>
            . <br></br>
            A tutorial to create a such airdrop is available
            <Link color="blue.700" href='https://github.com/PhilippeR26/Airdrop-for-Starknet' isExternal> here</Link>
            .
          </Box>
        </Center>
      </div >
      <LowerBanner></LowerBanner>
    </ChakraProvider>
  )
}


