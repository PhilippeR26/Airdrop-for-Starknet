import { Box, Button, Center, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, StackDivider, VStack, useDisclosure } from "@chakra-ui/react";
import { useStoreWallet } from "./walletContext";
import sn, {
  type DisconnectOptions,
  type GetWalletOptions,
  type StarknetWindowObject,
} from "get-starknet-core"
import { useEffect } from "react";
import { useState } from "react";
import { formatAddress } from "../../../utils/utils";
import { constants, encode, shortString } from "starknet";

enum Permission {
  Accounts = "accounts",
}

export function scanObjectForWallets(
  obj: Record<string, any>,
  isWalletObject: (wallet: any) => boolean,
): StarknetWindowObject[] {
  return Object.values(
    Object.getOwnPropertyNames(obj).reduce<
      Record<string, StarknetWindowObject>
    >((wallets, key) => {
      if (key.startsWith("starknet")) {
        const wallet = obj[key]
        console.log("wallet=", wallet);
        if (isWalletObject(wallet) && !wallets[wallet.id]) {
          wallets[wallet.id] = wallet
        }
      }
      return wallets
    }, {}),
  )
}

export const isWalletObj = (wallet: any): boolean => {
  try {
    return (
      wallet &&
      [
        // wallet's must have methods/members, see IStarknetWindowObject
        "request",
        "on",
        "off",
        "version",
        "id",
        "name",
        "icon",
      ].every((key) => key in wallet)
    )
  } catch (err) { }
  return false
}


export default function SelectWallet() {
  const { isOpen, onOpen, onClose } = useDisclosure() // to handle the window of wallet selection

  const myWallet = useStoreWallet(state => state.wallet);
  const setMyWallet = useStoreWallet(state => state.setMyWallet);

  const isConnected = useStoreWallet(state => state.isConnected);
  const setConnected = useStoreWallet(state => state.setConnected);

  const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);
  const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);

  const setAccount = useStoreWallet(state => state.setAccount);
  const setChain = useStoreWallet(state => state.setChain);
  const setAddressAccount = useStoreWallet(state => state.setAddressAccount);

  const [walletList, setWalletList] = useState<StarknetWindowObject[]>([]);


  const handleSelectedWallet = async (wallet: StarknetWindowObject) => {
    console.log("Trying to connect wallet=", wallet);
    await wallet.enable({ starknetVersion: "v5" } as any);
    setConnected(true); // zustand
    setMyWallet(wallet); // zustand
    setAccount(wallet.account); // zustand
    setAddressAccount(encode.sanitizeHex(wallet.account.address).toLowerCase()); // zustand
    if (wallet.chainId) {
      setChain(wallet.chainId.startsWith("0x") ? wallet.chainId : shortString.encodeShortString(wallet.chainId));
    } else {
      setChain(constants.StarknetChainId.SN_MAIN);
    }
    setSelectWalletUI(false);
    // console.log("End of handleSelectedWallet", isConnected);
  }

  useEffect(
    () => {
      console.log("Launch select wallet window.");
      const wallets: StarknetWindowObject[] = scanObjectForWallets(window, isWalletObj);
      console.log("SelectWallet.wallets =", wallets);
      setWalletList(wallets);
      onOpen();
      return () => { }
    },
    []
  )

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
              walletList.map((wallet: StarknetWindowObject, index: number) => {
                const iconW: string = wallet.icon;
                return <>
                  <Button id={"wId" + index.toString()}
                    leftIcon={<Image src={iconW} width={30} />}
                    onClick={() => {
                      handleSelectedWallet(wallet);
                      onClose()
                    }} >{wallet.name + ' ' + wallet.version}
                  </Button>
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