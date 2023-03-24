
// import { Text, Spinner } from "@chakra-ui/react";
import useSWR from "swr";
import { ProofAnswer, ResponseError } from "@/interfaces";
import axios from "axios";

// const fetcher = (url: string) => fetch(url).then((res) => res.json())

// function fetchProof(addr: string): string {
//     const { data, error, isLoading } = useSWR<Proof, ResponseError>('http://localhost:3000/api/merkle', fetcher)

//     if (error) { console.log("errlog =",error.message); return error.message; }
//     if (isLoading) return "Loading..."
//     if (!data) return "Your Wallet address is not eligible."
//     return data.amount.toString();
// }
async function fetchProof(addr: string): Promise<string> {
    // let data1: string = "En attente";
    const result = await fetch('http://127.0.0.1:3000/api/merkle?addr=0x123',{cache:"no-cache"})
    // console.log('resullt =', result.body);
    if (!result.ok) {
        throw new Error('Failed to read Merkle Tree : ' + result.status + " , " + result.statusText);
    }
    const re = await result.json();
    console.log("result1=",re);
    return "wwwwwwww";
}
// fetchProof("0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a")
type Props = { addr: string; }

async function MerkleDisplay({ addr }: Props) {
    const data = await fetchProof("0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a");
    return (
        <h1>
            {data}
            proof en arree
        </h1>
    )
}
const _MerkleDisplay = MerkleDisplay as unknown as (props: Props) => JSX.Element;
export { _MerkleDisplay as MerkleDisplay }
