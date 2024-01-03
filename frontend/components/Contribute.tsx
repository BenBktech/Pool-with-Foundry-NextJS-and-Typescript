import { Flex, Text, Input, Button, Heading } from "@chakra-ui/react"
import { useState } from "react"
import { contractAddress, abi } from "@/constants"

import { parseEther } from "viem"

import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'

const Contribute = ({ getDatas }) => {

    const [amount, setAmount] = useState<string>('')

    const contribute = async() => {
        try {
            console.log('okkkk');
            let money = parseEther(amount);
            console.log(money)
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: abi,
                functionName: 'contribute',
                value: money
            })
            const { hash } = await writeContract(request)
            const data = await waitForTransaction({
                hash: hash
            })
            console.log(data)
            console.log('okkkk3')
            await getDatas()
        }
        catch(e) {
            console.log(e)
        }
    }

    return (
        <>
            <Heading>Contribute</Heading>
            <Flex mt="1rem">
                <Input 
                    placeholder='Your amount in ETH' 
                    size='lg'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}  />
                <Button 
                    colorScheme='purple' 
                    size='lg'
                    onClick={() => contribute()}
                >
                    Contribute
                </Button>
            </Flex>
        </>
    )
}

export default Contribute