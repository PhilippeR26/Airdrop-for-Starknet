// Declare/Deploy a demo  of Airdrop contract
// Coded with Starknet.js v6.0.0-beta.11 a
// launch with npx ts-node src/scripts/merkleTree/airdropSJS6Goerli/4.deployAirdropGoerli.ts

import { Account, json, Contract, RpcProvider, RPC, Call, Calldata, CallData, shortString, constants } from "starknet";
import { account0OZSepoliaAddress, account0OZSepoliaPrivateKey } from "../../../A1priv/A1priv";
import { account5TestnetAddress, account5TestnetPrivateKey } from "../../../A1priv/A1priv";
import { infuraKey, account1MainnetAddress, account1MainnetPrivateKey, blastKey } from "../../../A-MainPriv/mainPriv";

import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

async function main() {
    // initialize Provider. Adapt to your needs
    // Starknet-devnet-rs
    // const provider = new RpcProvider({ nodeUrl: "http://127.0.0.1:5050/rpc" }); 
    // Goerli Testnet
     const provider = new RpcProvider({ nodeUrl: 'https://starknet-testnet.blastapi.io/' + blastKey + "/rpc/v0_5" }); 
    // local Pathfinder Sepolia Testnet node :
    // const provider = new RpcProvider({ nodeUrl: "http://192.168.1.11:9545/rpc/v0_6" }); 
    // local Pathfinder Sepolia Integration node :
    //const provider = new RpcProvider({ nodeUrl: "http://192.168.1.11:9550/rpc/v0_6" }); 
    // local Juno mainnet :
    //const provider = new RpcProvider({ nodeUrl: "http://192.168.1.11:6060/v0_6" }); //v0.6.0

    // Check that communication with provider is OK
    const ch = await provider.getChainId();
    console.log("chain Id =", shortString.decodeShortString(ch), ", rpc", await provider.getSpecVersion());
    
    // initialize account. Adapt to your case
    // *** Devnet-rs 
    // const privateKey0 = "0x71d7bb07b9a64f6f78ac4c816aff4da9";
    // const accountAddress0: string = "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691";
    // *** initialize existing Argent X Goerli Testnet  account
     const privateKey0 = account5TestnetPrivateKey;
     const accountAddress0 = account5TestnetAddress
    
    // *** initialize existing Argent X mainnet  account
    // const privateKey0 = account1MainnetPrivateKey;
    // const accountAddress0 = account1MainnetAddress

    // *** initialize existing Sepolia Testnet account
    // const privateKey0 = account0OZSepoliaPrivateKey;
    // const accountAddress0 = account0OZSepoliaAddress;

    // *** initialize existing Sepolia Integration account
    // const privateKey0 = account1IntegrationOZprivateKey;
    // const accountAddress0 = account1IntegrationOZaddress;

    const account0 = new Account(provider, accountAddress0, privateKey0);
    console.log('existing_ACCOUNT_ADDRESS=', accountAddress0);
    console.log('existing account connected.\n');

    // declare/deploy Airdrop test
    const compiledSierraAirdrop = json.parse(fs.readFileSync("./compiledContracts/cairo240/airdropSJS6.sierra.json").toString("ascii"));
    const compiledCasmAirdrop = json.parse(fs.readFileSync("./compiledContracts/cairo240/airdropSJS6.casm.json").toString("ascii"));
    //         👇👇👇
    // 🚨🚨🚨 Change addresses following execution of scripts src/scripts/merkleTree/2a.deployMerkleVerifPoseidonDevnet.ts 
    const ERC20_ADDRESS = "0x61376175ba2ddc307b30813312d8f09796f777b8c24dd327a5cdd65c3539fba";
    const MERKLE_VERIF_ADDRESS = "0x2f3fa62b030a9ab3e9ecbb6f44c6de196cb2c82465e88ebd903f14aa2d0a468";
    //         👆👆👆
    console.log('In progress...');
    const myCallAirdrop = new CallData(compiledSierraAirdrop.abi);
    const myConstructorAirdrop: Calldata = myCallAirdrop.compile("constructor", {
        erc20_address: ERC20_ADDRESS,
        merkle_address: MERKLE_VERIF_ADDRESS,
        erc20_owner: account0.address,
        start_time: 0, // no date of airdrop start
        consolation_remaining: 10_000,
    });
    const deployResponse = await account0.declareAndDeploy({
        contract: compiledSierraAirdrop,
        casm: compiledCasmAirdrop,
        constructorCalldata: myConstructorAirdrop
    });

    const airdropAddress = deployResponse.deploy.contract_address;
    const airdropClassHash = deployResponse.declare.class_hash;
    console.log("Airdrop contract :");
    console.log("class_hash =", airdropClassHash);
    console.log("address =", airdropAddress);

    // authorize the Airdrop contract to transfer some tokens
    const compiledSierraERC20 = json.parse(fs.readFileSync("compiledContracts/cairo220/erc20OZ070.sierra.json").toString("ascii"));
    const erc20Contract = new Contract(compiledSierraERC20.abi, ERC20_ADDRESS, account0);
    const authorize: Call = erc20Contract.populate("approve", {
        spender: airdropAddress,
        amount: 40_000,
    });
    const tx = await account0.execute(authorize);
    const txR = await provider.waitForTransaction(tx.transaction_hash);
    console.log("authorize =",txR.execution_status);

    console.log("✅ test completed.");
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });