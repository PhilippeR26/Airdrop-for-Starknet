import { constants } from "starknet";

export const ethAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const strkAddress = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export const myProviderUrl = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"; // Sepolia Testnet

export const networkName=constants.NetworkName.SN_SEPOLIA;
// 👉 change network in src/app/components/client/ConnectWallet/walletContext.ts for chain

export const MerkleVerifyContract = "0x14877859e56be2beca0a332e169dc6bfbbfcf6bc3ab7fe33759794114efa2ff";

export const erc20Class="0x779f8e128064c8663491f842e11970ca799620cbdc5d5600a312621cabf3c67";
 export const erc20Address="0x998bec0c912e4257bf87719bf6af2575ccebcd00fd284b8044d1e14fc30ce9"; // Sepolia Testnet 0 decimal

export const AirdropClass="0x3d1dc0268e3d4f6de27a2885769a8d57b2458c64e5c38fc3ec1442837883dcd"; // Sepolia testnet 
export const AirdropAddress="0x57ba0443c28b38ee4be0ae1e6f5e0a63a6e8b6cc6e352c997b6d0d24fe0b22d"; // Sepolia testnet 

//  treePath 👉 to update in first lines of src/app/server/airdropServer.ts
