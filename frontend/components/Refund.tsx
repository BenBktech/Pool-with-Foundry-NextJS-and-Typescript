'use client'

// ChakraUI
import { Flex, Text, Input, Button, Heading, useToast } from "@chakra-ui/react"

// ReactJS
import { useState } from "react"

// Constants and Types
import { contractAddress, abi } from "@/constants"
import { RefundProps } from "@/types"

// Viem
import { parseEther } from "viem"

// Wagmi
import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'

const Refund = ({ getDatas, end, goal, totalCollected }: RefundProps) => {

    const toast = useToast()

    const refund = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: abi,
                functionName: 'refund'
            })
            const { hash } = await writeContract(request)
            const data = await waitForTransaction({
                hash: hash,
            })
            await getDatas()
            toast({
                title: 'Congratulations',
                description: "You have been refunded.",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        }
        catch(e) {
            toast({
                title: 'Error',
                description: "An error occured",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    }

    return (
        <>
            <Heading mt='2rem'>Refund</Heading>
            <Flex mt="1rem">
                {totalCollected < goal && Math.floor(Date.now() / 1000) > parseInt(end) ? (
                    <Button 
                        colorScheme='red' 
                        size='lg'
                        width="100%"
                        onClick={() => refund()}
                    >
                        Refund
                    </Button>
                ) : (
                    <Text color='red'>No refund available right now.</Text>
                )}
            </Flex>
        </>
    )
}

export default Refund