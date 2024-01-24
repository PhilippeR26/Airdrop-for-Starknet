export function formatBalance(qty: bigint, decimals: number): string {
    const balance = String("0").repeat(decimals) + qty.toString();
    const rightCleaned = balance.slice(-decimals).replace(/(\d)0+$/gm, '$1');
    const leftCleaned = BigInt(balance.slice(0, balance.length - decimals)).toString();
    return leftCleaned + "." + rightCleaned;
}