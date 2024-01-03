'use client'
import { useState } from 'react'

import { useAccount } from 'wagmi'

import { contractAddress, abi } from '@/constants'
import { useEffect } from 'react'

import { Text, Progress, Heading, Spinner } from '@chakra-ui/react'

import { formatEther } from 'viem'

const Progression = ({ isLoading, end, goal, totalCollected }) => {

    const { address, isConnected } = useAccount()    

    return (
        <>
        {
            isLoading 
            ? <Spinner /> 
            : (
            <>
                <Heading mb="1rem">Progression</Heading>
                <Text mb=".5rem"><Text as='span' fontWeight="bold">End date :</Text> {end}</Text>
                <Progress 
                    colorScheme={(totalCollected / goal) * 100 < 100 ? 'red' : 'green'} 
                    height='32px' 
                    value={(totalCollected / goal) * 100} 
                    hasStripe 
                />
                <Text mt='.5rem'>
                    {parseFloat(formatEther(totalCollected)).toFixed(2)} ETH /{parseFloat(formatEther(goal)).toFixed(2)} ETH | <Text as='span' fontWeight='bold'>{((parseFloat(totalCollected) / parseFloat(goal)) * 100).toFixed(2)}%</Text>
                </Text>
            </>
        )}
        </>
    )
}

export default Progression