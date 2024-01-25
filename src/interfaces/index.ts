import * as Merkle from "starknet-merkle-tree";

export type ResponseError = { message: string };

export interface ProofAnswer {
    address: string,
    amount: bigint,
    proof: string[],
    leaf: Merkle.InputForMerkle,
    leafHash: string,
    isWhiteListed:boolean,
}