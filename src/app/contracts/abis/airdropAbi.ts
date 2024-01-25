export const airdropAbi=[
  {
    "type": "impl",
    "name": "MerkleVerifyContract",
    "interface_name": "airdropSJS6::airdropSJS6::IAirdrop"
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "interface",
    "name": "airdropSJS6::airdropSJS6::IAirdrop",
    "items": [
      {
        "type": "function",
        "name": "get_merkle_address",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_time",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "is_address_airdropped",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "is_address_consoled",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "qty_airdropped",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "remaining_consolation",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "claim_airdrop",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          },
          {
            "name": "proof",
            "type": "core::array::Array::<core::felt252>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "erc20_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "merkle_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "erc20_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "start_time",
        "type": "core::integer::u64"
      },
      {
        "name": "consolation_remaining",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "event",
    "name": "airdropSJS6::airdropSJS6::airdrop::Claimed",
    "kind": "struct",
    "members": [
      {
        "name": "address",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "airdropSJS6::airdropSJS6::airdrop::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Claimed",
        "type": "airdropSJS6::airdropSJS6::airdrop::Claimed",
        "kind": "nested"
      }
    ]
  }
]