"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { Center, Spinner, Text, Button } from '@chakra-ui/react';
import ClientComponent from './components/client/ClientComponent';
import { MerkleDisplay } from './components/MerkleDisplay';
import ClientMerkle from "./components/client/ClientMerkle";
import WalletConnect from "./components/client/WalletConnect";


import airdropImg from '../../public/Images/airdrop-for-Starknet.png'
import { use } from 'react';

// async function fetchProof(addr: string): Promise<string> {
//   // let data1: string = "En attente";
//   const result = await fetch('http://127.0.0.1:3000/api/merkle?addr=0x123', { cache: "no-cache" })
//   // console.log('resullt =', result.body);
//   if (!result.ok) {
//     throw new Error('Failed to read Merkle Tree : ' + result.status + " , " + result.statusText);
//   }
//   const re = await result.json();
//   console.log("result1=", re);
//   return "wwwwwwww";
// }

export default function Page() {
  // const data1 =  fetchProof("0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a");
  // const data2=use(data1);
  // console.log("data1 =", data1);

  // <Spinner color="white" size="xl" />

  // const result=use(fetchProof("0x123"));

  return (
    <div>
      <div className={styles.bgWrap}>
        <Image
          alt="Airdrop"
          src={airdropImg}
          placeholder="blur"
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      <p className={styles.bgText}>
        A
      </p>

      {/* <div>

        <Center>
          <ClientMerkle />
        </Center>
      </div> */}
      <div>
        <Center>
          <Text color="white" fontSize="50px">
            ...
            <WalletConnect />
          </Text>
        </Center>

      </div>


    </div >
  )
}


