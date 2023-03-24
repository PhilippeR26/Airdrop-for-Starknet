// "use client";
import Image from 'next/image'
import styles from './page.module.css'
import { Center, Spinner, Text,Button } from '@chakra-ui/react';
import ClientComponent from './components/client/ClientComponent';
import {MerkleDisplay} from './components/MerkleDisplay';

import airdropImg from '../../public/Images/airdrop-for-Starknet.png'
import { use } from 'react';
export default function Page() {
  // const data1 =  fetchProof("0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a");
  // const data2=use(data1);
  // console.log("data1 =", data1);
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
        Image Component2
        <br />
        as a Background
      </p>
      <Button>Connect Wallet</Button>
      <div>
        <ClientComponent>
          <MerkleDisplay addr="0x123"/>
        </ClientComponent>
        {/* <Center>
          <Spinner color="white" size="xl" />
          <Text color="white" fontSize="50px">
            dfgdgf =

          </Text>
        </Center> */}
      </div>
    </div >
  )
}


