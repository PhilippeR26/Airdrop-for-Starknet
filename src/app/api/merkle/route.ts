import { treeData } from "./treeTest";
import * as merkle from "./merkleLib";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { ResponseError, ProofAnswer } from "@/interfaces";
import { json ,num} from "starknet";

export async function GET(request: Request) {
    function recoverAddress(inp: merkle.inputForMerkle): string {
        if (typeof inp === 'string') { return inp }
        return inp[0];
    }

    function recoverAmount(inp: merkle.inputForMerkle): bigint {
        if (typeof inp === 'string') { return 0n }
        return num.toBigInt(inp[1]);
    }

    const tree = merkle.StarknetMerkleTree.load(treeData as merkle.StarknetMerkleTreeData);
    const { url } = request;
    const { searchParams } = new URL(url);
    const addr = searchParams.get("addr");
    if (addr === null) { return new NextResponse(undefined, { status: 415, statusText: "No address provided." }) }
    let pos: number = -1;
    for (const [i, v] of tree.entries()) {
        if (recoverAddress(v) === addr) {
            pos = i;
            break
        }
    }
    if (pos===-1) { return new NextResponse(undefined, { status: 404, statusText: "Address not in database." }) }

    const amountAirdrop:bigint=recoverAmount(tree.getInputData(pos));

    const proofT = tree.getProof(pos);

    const a: ProofAnswer = {
        address: addr,
        amount: amountAirdrop,
        proof: proofT,
        status:200,
        statusText:"",
    }
    const re = new NextResponse(json.stringify(a), { status: 200, statusText: "All fine" })
    return re

}
