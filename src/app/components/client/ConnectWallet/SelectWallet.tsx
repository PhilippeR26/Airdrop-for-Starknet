import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, StackDivider, VStack, useDisclosure } from "@chakra-ui/react";
import { useStoreWallet } from "./walletContext";
import { type StarknetWindowObject } from "./core/StarknetWindowObject"
import { useEffect } from "react";
import { useState } from "react";
import { addAddressPadding, constants, encode, shortString } from "starknet";
import { Permission } from "./core/rpcMessage";

type ValidWallet = {
  wallet: StarknetWindowObject;
  isValid: boolean;
}

export async function scanObjectForWallets(
  obj: Record<string, any>, // Browser window object
  isWalletObject: (wallet: any) => boolean, // fn to identify Starknet wallets
): Promise<ValidWallet[]> {
  const AllObjectsNames: string[] = Object.getOwnPropertyNames(obj); // names of objects of level -1 of window
  const listNames: string[] = AllObjectsNames.filter((name: string) =>
    name.startsWith("starknet")
  );
  const Wallets: StarknetWindowObject[] = Object.values(
    [...new Set(listNames)].reduce<Record<string, StarknetWindowObject>>(
      (wallets, name: string) => {
        const wallet = obj[name] as StarknetWindowObject;
        if (!wallets[wallet.id]) { wallets[wallet.id] = wallet }
        return wallets;
      },
      {}
    )
  );
  const validWallets: ValidWallet[] = await Promise.all(Wallets.map(
    async (wallet: StarknetWindowObject) => {
      const isValid = await checkCompatibility(wallet);
      return { wallet: wallet, isValid: isValid } as ValidWallet;
    }
  ))
  console.log(validWallets);
  return validWallets;
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

const checkCompatibility = async (myWallet: StarknetWindowObject) => {
  let isCompatible: boolean = false;
  try {
    await myWallet.request({ type: "starknet_supportedSpecs" });
    isCompatible = true;
  } catch {
    (err: any) => { console.log("Wallet compatibility failed.\n", err) };
  }
  return isCompatible;
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

  const [walletList, setWalletList] = useState<ValidWallet[]>([]);
  //const [hasPermissions, setHasPermissions] = useState<boolean>(false);


  // ******** with get-starknet
  // const handleSelectedWallet = async (wallet: StarknetWindowObject) => {
  //   console.log("Trying to connect wallet=", wallet);
  //   await wallet.enable({ starknetVersion: "v5" } as any);
  //   setConnected(true); // zustand
  //   setMyWallet(wallet); // zustand
  //   setAccount(wallet.account); // zustand
  //   setAddressAccount(encode.sanitizeHex(wallet.account.address).toLowerCase()); // zustand
  //   if (wallet.chainId) {
  //     setChain(wallet.chainId.startsWith("0x") ? wallet.chainId : shortString.encodeShortString(wallet.chainId));
  //   } else {
  //     setChain(constants.StarknetChainId.SN_MAIN);
  //   }
  //   setSelectWalletUI(false);
  //   // console.log("End of handleSelectedWallet", isConnected);
  // }

  // without get-starknet
  const handleSelectedWalletNew = async (wallet: StarknetWindowObject) => {
    let respRequest: Permission[] = [];
    try {
      console.log("Trying to connect wallet=", wallet);

      respRequest = await wallet.request({ type: "wallet_getPermissions" });
      console.log("permissions =", respRequest)
    } catch (err) {
      console.log("Error when request permissions :", err);
    }
    // .includes(Permission.Accounts)
    if (respRequest[0]=="accounts") {
      console.log("permissions=OK");
      //setHasPermissions(true);
      setMyWallet(wallet); // zustand
      setConnected(true); // zustand
      const accounts = await wallet.request({ type: "wallet_requestAccounts" });
      console.log("account address from wallet =", accounts);
      // setAccount(accounts[0]); // zustand
      setAddressAccount(addAddressPadding(accounts[0])); // zustand
      const chainId = (await wallet.request({ type: "wallet_requestChainId" })).toString();
      setChain(chainId);
      setSelectWalletUI(false);
    } else {
      console.log("permissions=Denied");
    }

  }

  useEffect(
    () => {
      const fetchData = async () => {
        const res = await scanObjectForWallets(window, isWalletObj);
        return res
      }
      console.log("Launch select wallet window.");
      fetchData().then((wallets) => setWalletList(wallets));
      //console.log("SelectWallet.wallets =", wallets);
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
                        handleSelectedWalletNew(wallet.wallet);
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