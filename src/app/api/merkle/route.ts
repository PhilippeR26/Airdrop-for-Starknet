import { treeData } from "./treeTest";
import * as merkle from "./merkleLib";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { ResponseError, Proof } from "@/interfaces";
import { json } from "starknet";

export async function GET(request: Request) {
    const tree = merkle.StarknetMerkleTree.load(treeData as merkle.StarknetMerkleTreeData);
    const { url } = request;
    const { searchParams }=new URL(url);
    const addr=searchParams.get("addr");
    //const { searchParams } = myUrl;
    // console.log("result requzest =", request);
    // console.log("result requzesturl =", url);
    // console.log("result requzestmyUrl =", myUrl);
    // console.log("result requzestmyUrlParams =", searchParams.get("addr"));
    
    // const { addr } = query;
    // for (const [i, v] of tree.entries()) {
    //     console.log('value:', v);
    //     console.log('proof:', tree.getProof(i));
    //     }
    // console.log("input 0 =",tree.getInputData(0));

    // const id=tree.entries()
    // const proof=tree.getProof(id);
    const a: Proof = {
        address: "0x123",
        amount: 21n,
        proof: ["0x01", "0x02"]
    }
    const re = new NextResponse(json.stringify(addr+"zob"), { status: 200, statusText: "All fine" })
    return re
    // return a
    // ? new NextApiResponse.status(200).json(a)
    // : result.status(404).json({ message: `User with addr: ${addr} not found.` })
}
