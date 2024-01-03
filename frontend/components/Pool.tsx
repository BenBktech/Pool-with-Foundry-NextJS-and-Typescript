'use client'
import { useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'

import { Alert, AlertIcon } from '@chakra-ui/alert'

import Contribute from './Contribute'
import Progression from './Progression'

import { contractAddress, abi } from '@/constants'

import { useState, useEffect } from 'react'

const Pool = () => {

    const { address, isConnected } = useAccount()

    const [end, setEnd] = useState<string>()
    const [goal, setGoal] = useState<number>()
    const [totalCollected, setTotalCollected] = useState<number>()

    const getDatas = async() => {
        if(isConnected) {
            let data = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'end',
            })
            let date = new Date(parseInt(data) * 1000);
            let endDate: string = date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear()
            setEnd(endDate)

            data = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'goal',
            })
            setGoal(data.toString())
            console.log(data.toString())

            data = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'totalCollected',
            })
            setTotalCollected(data.toString())
            console.log(data.toString())
        }
    }

    useEffect(() => {
        getDatas()
    }, [address])

    
    return (
        <>
            {isConnected ? (
                <>
                    <Progression end={end} goal={goal} totalCollected={totalCollected} />
                    <Contribute getDatas={getDatas} />
                </>
                
            ) : (
                <Alert status='warning'>
                    <AlertIcon />
                    Please connect your wallet to our DApp.
                </Alert>
            )}
        </>
    )
}

export default Pool