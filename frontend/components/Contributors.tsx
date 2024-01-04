'use client'

// ChakraUI
import { Flex, Heading, Card, CardBody, Text } from "@chakra-ui/react"

// Viem
import { formatEther, parseEther } from "viem"

// Types
import { ContributorsProps } from "@/types"

const Contributors = ({ events }: ContributorsProps) => {    
    return (
        <>
            <Heading mt='2rem'>Contributors</Heading>
            <Flex mt="1rem" direction="column">
                {events.map((event) => {
                    return (
                        <Card mb=".5rem" key={crypto.randomUUID()}>
                            <CardBody>
                                <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Text>{event.contributor.substring(0, 5)}...{event.contributor.substring(event.contributor.length - 5)}</Text>
                                    <Text>
                                        {formatEther(BigInt(event.amount))} ETH
                                    </Text>
                                </Flex>
                            </CardBody>
                        </Card>
                    )
                })}
            </Flex>
        </>
    )
}

export default Contributors