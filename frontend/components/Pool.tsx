'use client'

// React
import { useState, useEffect } from 'react'

// Wagmi
import { useAccount, usePublicClient } from 'wagmi'
import { readContract, watchContractEvent  } from '@wagmi/core'

// Constants and Types
import { Contributor } from '@/types'
import { contractAddress, abi } from '@/constants'

// ChakraUI
import { Alert, AlertIcon } from '@chakra-ui/alert'

// Components
import Contribute from './Contribute'
import Progression from './Progression'
import Refund from './Refund'
import Contributors from './Contributors'

// Viem
import { parseAbiItem } from 'viem'
import { Log } from 'viem'

const Pool = () => {

    const client = usePublicClient()

    const { address, isConnected } = useAccount()

    const [end, setEnd] = useState<string>('')
    const [goal, setGoal] = useState<string>('')
    const [totalCollected, setTotalCollected] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [events, setEvents] = useState<Contributor[]>([])

    const getDatas = async() => {
        if(isConnected) {
            setIsLoading(true)

            // Get Date
            let data: any = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'end',
            })

            // Date Managment
            let date = new Date(parseInt(data) * 1000);
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            let endDate: string = day + "/" + month + "/" + year
            setEnd(endDate)

            // Get Goal
            data = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'goal',
            })
            setGoal(data.toString())

            // Get TotalCollected
            data = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'totalCollected',
            })
            setTotalCollected(data.toString())

            // Get Events
            const ContributeLogs = await client.getLogs({  
                address: contractAddress,
                event: parseAbiItem('event Contribute(address indexed contributor, uint256 amount)'),
                // fromBlock: BigInt(Number(await client.getBlockNumber()) - 15000),
                fromBlock: 0n,
                toBlock: 'latest'
            })
            setEvents(ContributeLogs.map(
                log => ({
                    contributor: log.args.contributor as string,
                    amount: (log.args.amount as bigint).toString()
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
                    <Refund getDatas={getDatas} end={end} goal={goal} totalCollected={totalCollected} />
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