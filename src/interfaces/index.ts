export type ResponseError = { message: string };

export interface Proof {
    address: string,
    amount: bigint,
    proof: string[],
}