import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, StackDivider, VStack, useDisclosure } from "@chakra-ui/react";
import { useStoreWallet } from "./walletContext";
import { useEffect } from "react";
import { useState } from "react";
import { addAddressPadding, constants, encode, shortString } from "starknet";
import { WALLET_API } from "@starknet-io/types-js";
import {isWalletObject} from "@starknet-io/get-starknet-core";

type ValidWallet = {
  wallet: WALLET_API.StarknetWindowObject;
  isValid: boolean;
}

// fn to identify Starknet wallets.
// Can also be performed by get-starknet.
export async function scanObjectForWallets(
  obj: Record<string, any>, // Browser window object
  isWalletObject: (wallet: any) => boolean, 
): Promise<ValidWallet[]> {
  const AllObjectsNames: string[] = Object.getOwnPropertyNames(obj); // names of objects of level -1 of window
  const listNames: string[] = AllObjectsNames.filter((name: string) =>
    name.startsWith("starknet")
  );
  const Wallets: WALLET_API.StarknetWindowObject[] = Object.values(
    [...new Set(listNames)].reduce<Record<string, WALLET_API.StarknetWindowObject>>(
      (wallets, name: string) => {
        const wallet = obj[name] as WALLET_API.StarknetWindowObject;
        if (!wallets[wallet.id]) { wallets[wallet.id] = wallet }
        return wallets;
      },
      {}
    )
  );
  const validWallets: ValidWallet[] = await Promise.all(Wallets.map(
    async (wallet: WALLET_API.StarknetWindowObject) => {
      const isValid = await checkCompatibility(wallet);
      return { wallet: wallet, isValid: isValid } as ValidWallet;
    }
  ))
  console.log(validWallets);
  return validWallets;
}

const checkCompatibility = async (myWalletSWO: WALLET_API.StarknetWindowObject) => {
  let isCompatible: boolean = false;
  try {
    // *** TODO : Replace this request by Wallet api version, when available in Wallets.
    // starknet_supportedSpecs for ArgentX
    // wallet_supportedSpecs for Braavos
    // wallet_supportedWalletApi in the spec 
    await myWalletSWO.request({ type: "wallet_supportedSpecs" });
    isCompatible = true;
  } catch {
    (err: any) => { console.log("Wallet compatibility failed.") };
  }
  return isCompatible;
}

export default function SelectWallet() {
  const { isOpen, onOpen, onClose } = useDisclosure() // to handle the window of wallet selection

  const myWallet = useStoreWallet(state => state.walletSWO);
  const setMyWallet = useStoreWallet(state => state.setMyWalletSWO);


  const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);
  const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);

    const [walletList, setWalletList] = useState<ValidWallet[]>([]);


  useEffect(
    () => {
      const fetchData = async () => {
        const res = await scanObjectForWallets(window, isWalletObject);
        return res
      }
      console.log("Launch select wallet window.");
      fetchData().then((wallets) => setWalletList(wallets));
      onOpen();
      return () => { }
    },
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectWalletUI(false);
        onClose()
      }}
      closeOnOverlayClick={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize='lg' fontWeight='bold'>
          Select a wallet.
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={3}
            align='stretch'
          >
            {
              walletList.map((wallet: ValidWallet, index: number) => {
                const iconW: string = typeof (wallet.wallet.icon) == "string" ? wallet.wallet.icon : wallet.wallet.icon.light;

                return <>
                  {wallet.isValid ? <>
                    <Button id={"wId" + index.toString()}
                      leftIcon={<Image src={iconW} width={30} />}
                      onClick={() => {
                        setMyWallet(wallet.wallet); // zustand
                        setSelectWalletUI(false);
                        onClose()
                      }} >{wallet.wallet.name + ' ' + wallet.wallet.version}
                    </Button>
                  </> : <>
                    <Button id={"wId" + index.toString()}
                      backgroundColor="orange"
                      isDisabled={true}
                      leftIcon={<Image src={iconW} width={30} />}
                    >{wallet.wallet.name + ' ' + wallet.wallet.version + " not compatible!"}
                    </Button>
                  </>}
                </>
              })

            }
          </VStack>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
