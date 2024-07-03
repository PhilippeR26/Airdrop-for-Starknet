"use server";

import * as Merkle from "starknet-merkle-tree";
import fs from "fs";
import type { ProofAnswer } from "@/interfaces";
import { revalidatePath } from "next/cache";
import { addAddressPadding, constants, encode, uint256 } from "starknet";
//                           👇👇👇 be sure to link to the right file
import treeExtSepolia from "./tree/treeListAddressSepolia.json";
import treeExtMainnet from "./tree/treeListAddressMainnet.json";
import { networkName } from "../utils/constants";


export async function checkWhitelist(accountAddress: string): Promise<ProofAnswer> {
    const address = addAddressPadding(accountAddress);
    console.log(address);
    let treeExt: Merkle.StarknetMerkleTreeData;
    const workaround=String(constants.NetworkName.SN_MAIN);
    if (networkName == workaround) {
        treeExt = treeExtMainnet as Merkle.StarknetMerkleTreeData
    } else {
        treeExt = treeExtSepolia as Merkle.StarknetMerkleTreeData
    }
    const tree = Merkle.StarknetMerkleTree.load(treeExt);
    const indexAddress = tree.dump().values.findIndex((leaf, idx: number) => addAddressPadding(leaf.value[0]) == address);
    if (indexAddress === -1) {
        return ({
            address: accountAddress,
            amount: 0n,
            proof: [],
            leaf: [],
            leafHash: "",
            isWhiteListed: false,
        });
    }
    const inpData = tree.getInputData(indexAddress);
    const leafHash = Merkle.StarknetMerkleTree.leafHash(inpData, Merkle.HashType.Poseidon);
    const proof = tree.getProof(indexAddress);
    // revalidatePath("/"); // clear cache and update result
    return {
        address: accountAddress,
        amount: uint256.uint256ToBN({ low: inpData[1], high: inpData[2] }),
        proof,
        leaf: inpData,
        leafHash,
        isWhiteListed: true,
    }
}