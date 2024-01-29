// Declare/Deploy in Goerli an ERC20 token
// Coded with Starknet.js v6.0.0-beta.11 
// launch with npx ts-node src/scripts/merkleTree/airdropSJS6Goerli/3.deployTokenGoerli.ts

import { Account, Call, Calldata, CallData, Contract, json, RPC, RpcProvider, shortString } from 'starknet';
import { account5TestnetAddress, account5TestnetPrivateKey } from "../../../A1priv/A1priv";
import { infuraKey, account1MainnetAddress, account1MainnetPrivateKey, blastKey } from "../../../A-MainPriv/mainPriv";

import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // initialize Provider. Adapt to your needs
    // Starknet-devnet-rs
    // const provider = new RpcProvider({ nodeUrl: "http://127.0.0.1:5050/rpc" }); 
    // Goerli Testnet
    const provider = new RpcProvider({ nodeUrl: 'https://starknet-testnet.blastapi.io/' + blastKey + "/rpc/v0_5" });
    // local Pathfinder Sepolia Testnet node :
    //const provider = new RpcProvider({ nodeUrl: "http://192.168.1.7:9545/rpc/v0_6" });
    // local Pathfinder Sepolia Integration node :
    //const provider = new RpcProvider({ nodeUrl: "http://192.168.1.7:9550/rpc/v0_6" }); 
    // local Juno mainnet :
    //const provider = new RpcProvider({ nodeUrl: "http://192.168.1.7:6060/v0_6" }); //v0.6.0

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

    // deploy ERC20
    const compiledSierraERC20 = json.parse(fs.readFileSync("./compiledContracts/cairo210/erc20OZ070decimals.sierra.json").toString("ascii"));
    const compiledCasmERC20 = json.parse(fs.readFileSync("./compiledContracts/cairo210/erc20OZ070decimals.casm.json").toString("ascii"));
    const myCallERC20 = new CallData(compiledSierraERC20.abi);
    const myConstructorERC20: Calldata = myCallERC20.compile("constructor", {
        name: "Starknet.js-v6-celebration",
        symbol: "SJS6",
        decimals: 0,
        initial_supply: 40_000,
        recipient: account0.address,

    });
    const deployResponseERC20 = await account0.declareAndDeploy({
        contract: compiledSierraERC20,
        casm: compiledCasmERC20,
        constructorCalldata: myConstructorERC20
    });
    const erc20Address = deployResponseERC20.deploy.contract_address;
    const erc20ClassHash = deployResponseERC20.declare.class_hash;
    console.log("ERC20 contract :");
    console.log("class_hash =", erc20ClassHash);
    console.log("address =", erc20Address);

    console.log("✅ test completed.");
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

    
    
