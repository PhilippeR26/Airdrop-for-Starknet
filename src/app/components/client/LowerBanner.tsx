"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center,Link } from "@chakra-ui/react"

export default function LowerBanner() {
    return(
        <Box
            position={"fixed"}
            height="50px"
            bottom="0%"
            width="100%"
            marginTop="1"
            borderColor="black"
            borderWidth="2px"
            borderRadius="0"
            bg='white'
            opacity="60%"
            p="2"
            textAlign={'center'}
            fontSize="16"
            fontWeight="extrabold"
            color="grey.800"
          >
            Powered by
            <Link color="blue.700" href='https://starknetjs.com' isExternal> Starknet.js v6<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
             , <Link color="blue.700" href='https://github.com/PhilippeR26/starknetMerkleTree' isExternal> Starknet-merkle-tree v1<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>,
            
            <Link color="blue.700" href='https://github.com/starknet-io/get-starknet' isExternal> get-starknet v3.0.2<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
            .
          </Box>
    )
}