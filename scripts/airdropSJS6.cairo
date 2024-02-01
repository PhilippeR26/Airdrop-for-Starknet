// Example of Airdrop contract
// Coded with Cairo 2.4.0 
// contract not audited ; use at your own risks.

use starknet::ContractAddress;

#[starknet::interface]
trait IERC20<TContractState> {
    fn name(self: @TContractState) -> felt252;
    fn symbol(self: @TContractState) -> felt252;
    fn decimals(self: @TContractState) -> u8;
    fn totalSupply(self: @TContractState) -> u256;
    fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256);
    fn transferFrom(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    );
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256);
    fn increaseAllowance(ref self: TContractState, spender: ContractAddress, added_value: u256);
    fn decreaseAllowance(
        ref self: TContractState, spender: ContractAddress, subtracted_value: u256
    );
}

#[starknet::interface]
trait IMerkleVerify<TContractState> {
    fn get_root(self: @TContractState) -> felt252;
    fn verify_from_leaf_hash(
        self: @TContractState, leaf_hash: felt252, proof: Array<felt252>
    ) -> bool;
    fn verify_from_leaf_array(
        self: @TContractState, leaf_array: Array<felt252>, proof: Array<felt252>
    ) -> bool;
    fn verify_from_leaf_airdrop(
        self: @TContractState, address: ContractAddress, amount: u256, proof: Array<felt252>
    ) -> bool;
    fn hash_leaf_array(self: @TContractState, leaf: Array<felt252>) -> felt252;
}

#[starknet::interface]
trait IAirdrop<TContractState> {
    fn get_merkle_address(self: @TContractState) -> ContractAddress;
    fn get_erc20_address(self: @TContractState) -> ContractAddress;
    fn get_start_time(self: @TContractState) -> u64;
    fn get_current_time(self: @TContractState)->u64;
    fn is_address_airdropped(self: @TContractState, address: ContractAddress) -> bool;
    fn is_address_consoled(self: @TContractState, address: ContractAddress) -> bool;
    fn qty_airdropped(self: @TContractState) -> u256;
    fn remaining_consolation(self: @TContractState) -> u256;
    fn claim_airdrop(ref self: TContractState, amount: u256, proof: Array<felt252>);
}

#[starknet::contract]
mod airdrop {
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::{IMerkleVerifyDispatcher, IMerkleVerifyDispatcherTrait};
    use super::IAirdrop;
    use core::option::OptionTrait;
    use starknet::{ContractAddress, SyscallResultTrait, contract_address_const};
    use starknet::get_block_timestamp;
    use core::hash::HashStateExTrait;
    use hash::{HashStateTrait, Hash};
    use array::{ArrayTrait, SpanTrait};
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        erc20_address: ContractAddress,
        start_time: u64,
        merkle_address: ContractAddress,
        erc20_owner: ContractAddress,
        merkle_root: felt252,
        airdrop_performed: LegacyMap::<ContractAddress, bool>,
        airdrop_qty_performed: u256,
        consolation_performed: LegacyMap::<ContractAddress, bool>,
        consolation_remaining: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Claimed: Claimed
    }

    #[derive(Drop, starknet::Event)]
    struct Claimed {
        address: ContractAddress,
        amount: u256
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        erc20_address: ContractAddress,
        merkle_address: ContractAddress,
        erc20_owner: ContractAddress,
        start_time: u64,
        consolation_remaining: u256,
    ) {
        self.erc20_address.write(erc20_address);
        self.merkle_address.write(merkle_address);
        self.erc20_owner.write(erc20_owner);
        self.start_time.write(start_time);
        self.consolation_remaining.write(consolation_remaining);
        self.airdrop_qty_performed.write(0_u256);
    }

    #[external(v0)]
    impl MerkleVerifyContract of super::IAirdrop<ContractState> {
        // returns the address of the merkle verify contract for this airdrop
        fn get_merkle_address(self: @ContractState) -> ContractAddress {
            self.merkle_address.read()
        }

        // returns the address of the erc20 
        fn get_erc20_address(self: @ContractState) -> ContractAddress {
            self.erc20_address.read()
        }

        // returns the timestamp of start of airdrop 
        fn get_start_time(self: @ContractState) -> u64 {
            self.start_time.read()
        }

        fn is_address_airdropped(self: @ContractState, address: ContractAddress) -> bool {
            self.airdrop_performed.read(address)
        }

        fn is_address_consoled(self: @ContractState, address: ContractAddress) -> bool {
            self.consolation_performed.read(address)
        }

        fn qty_airdropped(self: @ContractState) -> u256 {
            self.airdrop_qty_performed.read()
        }

        fn remaining_consolation(self: @ContractState) -> u256 {
            self.consolation_remaining.read()
        }

        fn get_current_time(self: @ContractState)->u64 {
            get_block_timestamp()
        }

        fn claim_airdrop(ref self: ContractState, amount: u256, proof: Array<felt252>) {
            let address = get_caller_address();
            let already_airdropped: bool = self.airdrop_performed.read(address);
            assert(!already_airdropped, 'Address already airdropped');
            let current_time: u64 = get_block_timestamp();
            let airdrop_start_time: u64 = self.start_time.read();
            assert(current_time >= airdrop_start_time, 'Airdrop has not started yet.');

            let is_request_valid: bool = IMerkleVerifyDispatcher {
                contract_address: self.merkle_address.read()
            }
                .verify_from_leaf_airdrop(address, amount, proof);
            if is_request_valid {
                assert(!self.consolation_performed.read(address) , 'Malicious. Already consoled.');
                // Airdrop
                // Register the address as already consoled
                self.airdrop_performed.write(address, true);
                self.airdrop_qty_performed.write(self.airdrop_qty_performed.read() + amount);
                // to be sure to perform the airdrop only once per address.

                // Perform here your transfer of token.
                IERC20Dispatcher { contract_address: self.erc20_address.read() }
                    .transferFrom(self.erc20_owner.read(), address, amount);
                // create some events.
                self.emit(Claimed { address: address, amount: amount });
            } else {
                assert(self.consolation_remaining.read() > 0, 'Too late, no more consol. prize');
                let already_consoled: bool = self.consolation_performed.read(address);
                assert(!already_consoled, 'Address already consoled');
                // consolation prize
                // Register the address as already consoled
                self.consolation_performed.write(address, true);
                self.consolation_remaining.write(self.consolation_remaining.read() - 1);
                // to be sure to perform the consolation only once per address.

                // Perform here your transfer of token.
                IERC20Dispatcher { contract_address: self.erc20_address.read() }
                    .transferFrom(self.erc20_owner.read(), address, 1_u256);
                // create some events.
                self.emit(Claimed { address: address, amount: 1_u256 });
            }
            return ();
        }
    }
}

