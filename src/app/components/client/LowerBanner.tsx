"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center,Link } from "@chakra-ui/react"

export default function LowerBanner() {
    return(
        <Box
            position={"fixed"}
            bottom="0%"
            width="100%"
            marginTop="1"
            borderColor="black"
            borderWidth="0px"
            borderRadius="0"
            bg='grey'
            opacity="95%"
            p="2"
            textAlign={'center'}
            fontSize="16"
            fontWeight="extrabold"
            color="grey.800"
            textColor="black"
          >
            Powered by
            <Link color="blue.700" href='https://starknetjs.com' isExternal> Starknet.js v6.17.0<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
             , <Link color="blue.700" href='https://github.com/PhilippeR26/starknetMerkleTree' isExternal> Starknet-merkle-tree v1.0.2<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>,
            
            <Link color="blue.700" href='https://github.com/starknet-io/get-starknet' isExternal> get-starknet v4.0.1<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
            ,
            <Link color="blue.700" href='https://github.com/apibara/starknet-react/tree/next-v3' isExternal> starknet-react v3.0.0<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
            .
          </Box>
    )
}