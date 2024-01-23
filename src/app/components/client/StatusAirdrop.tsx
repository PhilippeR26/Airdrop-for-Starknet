import { Box, Center } from "@chakra-ui/react";

export default function StatusAirdrop() {
return <Center>
<Box
  marginTop="1"
  marginBottom="5"
  w="80vw" 
  borderRadius="xl"
  bg='pink'
  opacity="70%"
  p="2"
  textAlign={'center'}
  fontSize="18"
  fontWeight="bold"
  color="red.800"
>
  40 000 tokens are reserved to a list of 1 400 highly active addresses. <br></br>
  10 000 tokens are reserved for the fastest non white listed addresses.
</Box>
</Center>
}
