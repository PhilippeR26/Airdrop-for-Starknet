"use client";
import { Button, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UnorderedList, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

export default function InitialDisclaimer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    useEffect(() => {
        onOpen();
      }
        , []);

    return (
      <>
        <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />

                    <ModalContent>
                        <ModalHeader fontSize='lg' fontWeight='bold'>
                            Disclaimer.
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            This airdrop is NOT related to the Starknet foundation.<br />
                            This airdrop is NOT related to the Starkware company.<br />
                            This Airdrop is NOT related to the Stark (STRK) airdrop.<br /><br />
                            This airdrop is celebrating major updates of the most useful JS tools necessary to create a Starknet DAPP : <br />
                            <UnorderedList pl={5}>
                                <ListItem>Starknet.js v6.11.0</ListItem>
                                <ListItem>Starknet-merkle-tree v1.0.2</ListItem>
                                <ListItem>Get-starknet v4.0.0</ListItem>
                                <ListItem>Starknet-react v3.0.0</ListItem>
                            </UnorderedList>

                        </ModalBody>

                        <ModalFooter>
                            {/* <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button> */}
                            <Button colorScheme='red' onClick={onClose} ml={3}>
                                Understood
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
      </>
    );
  }