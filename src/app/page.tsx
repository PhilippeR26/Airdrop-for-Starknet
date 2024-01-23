"use server";
import NextImage from 'next/image'
import styles from './page.module.css'
import { Center, Spinner, Text, Button, ChakraProvider, Box, Link } from '@chakra-ui/react';
import ClientComponent from './components/client/ClientComponent';
import { MerkleDisplay } from './components/MerkleDisplay';

import airdropImg from '../../public/Images/airdrop-for-Starknet.jpg'
import { use } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import StatusAirdrop from './components/client/StatusAirdrop';
export default async function Page() {
  // const data1 =  fetchProof("0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a");
  // const data2=use(data1);
  // console.log("data1 =", data1);
  return (
    <ChakraProvider>
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
        <Box textAlign={'right'} p="3"><Button colorScheme="pink"  >Connect Wallet</Button> <br /> </Box>
        <Center>
          <Box
            marginTop={2}
            marginBottom={7}
            w="480px" h="130px"
            borderRadius="full"
            bg='pink'
            opacity="80%"
            p="2"
            textAlign={'center'}
            fontSize="36"
            fontWeight="extrabold"
            color="red.600"
          >
            STARKNET <br></br>
            'SNJS6' TOKEN AIRDROP
          </Box>
        </Center>
        <StatusAirdrop></StatusAirdrop>
        <Center>Claim WTF tokens</Center>
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
        <Button>Connect Wallet</Button>
        {/* <div>
        <ClientComponent>
          <MerkleDisplay addr="0x123"/>
        </ClientComponent>
        <Center>
          <Spinner color="white" size="xl" />
          <Text color="white" fontSize="50px">
            dfgdgf =

          </Text>
        </Center>
      </div> */}
      </div >
    </ChakraProvider>
  )
}


