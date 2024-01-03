import { Flex, Heading, Card, CardBody, Text } from "@chakra-ui/react"

import { formatEther, parseEther } from "viem"

const Contributors = ({ events }) => {
    console.log(events)
    return (
        <>
            <Heading mt='2rem'>Contributors</Heading>
            <Flex mt="1rem" direction="column">
                {events.map((event) => {
                    return (
                        <Card mb=".5rem">
                            <CardBody>
                                <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Text>{event.contributor.substring(0, 5)}...{event.contributor.substring(event.contributor.length - 5)}</Text>
                                    <Text
                                        color={
                                            event.amount > parseEther('2') ? (
                                                'green'
                                            ) : (
                                                'orange'
                                            )
                                        }
                                    >
                                        {formatEther(event.amount)} ETH
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