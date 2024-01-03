'use client'
import { useAccount, usePublicClient } from 'wagmi'
import { readContract, watchContractEvent  } from '@wagmi/core'

import { Alert, AlertIcon } from '@chakra-ui/alert'

import Contribute from './Contribute'
import Progression from './Progression'
import Refund from './Refund'
import Contributors from './Contributors'

import { contractAddress, abi } from '@/constants'

import { useState, useEffect } from 'react'

import { parseAbiItem } from 'viem'

const Pool = () => {

    // Client Viem
    const client = usePublicClient()

    const { address, isConnected } = useAccount()

    const [end, setEnd] = useState<string>('')
    const [goal, setGoal] = useState<string>('')
    const [totalCollected, setTotalCollected] = useState<string>('')

    const [events, setEvents] = useState([])

    const [isLoading, setIsLoading] = useState<boolean>(false)

    

    const getDatas = async() => {
        if(isConnected) {
            setIsLoading(true)
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

            const ContributeLogs = await client.getLogs({  
                address: contractAddress,
                event: parseAbiItem('event Contribute(address indexed contributor, uint256 amount)'),
                // fromBlock: BigInt(Number(await client.getBlockNumber()) - 15000),
                fromBlock: 0n,
                toBlock: 'latest'
            })
            setEvents(ContributeLogs.map(
                log => ({
                    contributor: log.args.contributor,
                    amount: log.args.amount.toString()
                })
            ))
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getDatas()
    }, [address])
    
    return (
        <>
            {isConnected ? (
                <>
                    <Progression isLoading={isLoading} end={end} goal={goal} totalCollected={totalCollected} />
                    <Contribute getDatas={getDatas} />
                    <Contributors events={events} />
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