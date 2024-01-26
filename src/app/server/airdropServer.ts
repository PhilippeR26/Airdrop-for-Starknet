"use server";

import * as Merkle from "starknet-merkle-tree";
import fs from "fs";
import { ProofAnswer } from "@/interfaces";
import { revalidatePath } from "next/cache";
import { uint256 } from "starknet";
import { treePath } from "../utils/constants";
import { treeAddresses } from "../tree/treeListAddressDevnet";


export async function checkWhitelist(accountAddress: string): Promise<ProofAnswer> {
    const tree = Merkle.StarknetMerkleTree.load(
        JSON.parse(treeAddresses)
    );
    const indexAddress = tree.dump().values.findIndex((leaf) => leaf.value[0] == accountAddress);
    if (indexAddress === -1) {
        return ({
            address: accountAddress,
            amount: 0n,
            proof: [],
            leaf:[],
            leafHash:"",
            isWhiteListed: false,
        });
    }
    const inpData = tree.getInputData(indexAddress);
    const leafHash = Merkle.StarknetMerkleTree.leafHash(inpData, Merkle.HashType.Poseidon);
    const proof = tree.getProof(indexAddress);
    // revalidatePath("/"); // clear cache and update result
    return {
        address: accountAddress,
        amount: uint256.uint256ToBN({low:inpData[1],high:inpData[2]}),
        proof,
        leaf:inpData,
        leafHash,
        isWhiteListed: true,
    }
}