"use client";
import { use, useEffect, useMemo, useState } from 'react';
import { ProofAnswer } from "@/interfaces";
import { Center, Spinner, Text, Button } from '@chakra-ui/react';

enum StatusFetch { Never, InProgress, Answered, Error }
// interface DataFetch {
//     result: ProofAnswer,
//     status: StatusFetch,
// }



// const resu=use(fetchProof("0x123"));


export default function ClientMerkle() {
    const ADDR = "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a";

    const [etat, setEtat] = useState<StatusFetch>(StatusFetch.Never);

    async function fetchProof(addr: string): Promise<ProofAnswer> {
        // let data1: string = "En attente";
        const result = await fetch('http://127.0.0.1:3000/api/merkle?addr=' + ADDR)
        // { cache: "no-cache" }
        // console.log('resullt =', result.body);
        const re = await result.json();
        const re2: ProofAnswer = {
            address: re.address,
            proof: re.proof,
            amount: re.amount,
            status: result.status,
            statusText: result.statusText
        };
        console.log("result1=", re2);
        return re2;
    }

     const [response, setResponse] = useState<ProofAnswer>({ address: "", amount: 0n, proof: [] ,status:200,statusText:""});
    // useEffect(() => {
    //     setEtat(StatusFetch.InProgress);
    //     const res = use(fetchProof(addr));
    //     setEtat(StatusFetch.Answered)
    // }, [addr]);
    useEffect(() => {fetchProof(ADDR).then((r)=>{setResponse(r)})},[]);
    return (
        <Text color="white" fontSize="20px">
            address={response.address}
            <br></br>

            Eligible for {response.amount.toString()} ECU
            <br></br>
            proof= {response.proof.toString().slice(0,30)+"..."}
        </Text>
    );
}

// {etat === StatusFetch.Answered &&
//     <>
//         address={response.address}
//         <br></br>

//         Eligible for {response.amount.toString()} ECU
//         <br></br>
//         proof= {response.proof.toString()}
//     </>
// }
// {etat === StatusFetch.Never &&
//     <>
//         not requested
//     </>
// }
// {etat === StatusFetch.InProgress &&
//     <>
//         not requested
//     </>
// }
