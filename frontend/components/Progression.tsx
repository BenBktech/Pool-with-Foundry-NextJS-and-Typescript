'use client'
import { useState } from 'react'

import { useAccount } from 'wagmi'

import { contractAddress, abi } from '@/constants'
import { useEffect } from 'react'

import { Text, Progress, Heading } from '@chakra-ui/react'

const Progression = ({ end, goal, totalCollected }) => {

    const { address, isConnected } = useAccount()    

    return (
        <>
            <Heading>Progression</Heading>
            <Text>End date : {end}</Text>
            <Progress colorScheme='green' height='32px' value={(totalCollected / goal) * 100} />
            <Text>{totalCollected} / {goal}</Text>
        </>
    )
}

export default Progression