"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { getorder, fetchcheckout, decreaseproductfromcheckout, sendReviewEmail } from '@/actions/useraction'
import Link from 'next/link'
import { useSession } from 'next-auth/react'


const page = ({ params }) => {
    const [order, setorder] = useState({})
    const [error, setError] = useState(null);
    const { data: session, status } = useSession()
    useEffect(() => {
        if (status === "loading") {
            return;
        }
        if (session) {

            let a = params.slug0
            let b = a.split("?")[0]
            try{
                getdata(b)
            }catch(e){
                setError(e.message);
            }
        }
    }, [status,session])

    const getdata = async (oid) => {
        let a = await getorder(oid)
        setorder(a)



        let x = await fetchcheckout(a.email)
        let y =[]
        y.push(x[0])

         let f = await sendReviewEmail(a.email,y)
        try{

            let j = await decreaseproductfromcheckout(a.email,oid)
        }catch(e){
            setError(e.message);
        }
    }

    return (
        <div className='flex justify-center gap-2 my-[10vh] flex-col items-center'>
            <div className='shadow-lg shadow-slate-300 w-[35vw] bg-slate-100 px-[6vw] py-[5vh]'>
                <div className='pb-[5vh] text-lg'>Order Details</div>
                <div className='text-xs flex flex-col  gap-[4vh]'>

                <div className='flex gap-1'><div className='whitespace-nowrap'>Order Id: </div><div className='text-slate-600'>{order.oid}</div></div>
                    <div className='flex gap-1'><div className='whitespace-nowrap'>Receiver Name: </div><div className='text-slate-600'>{order.name}</div></div>
                    <div className='flex gap-1'><div className='whitespace-nowrap'>Order Email: </div> <div className='text-slate-600'>  {order.email}</div></div>
                    <div className='flex gap-1'><div>Price: </div> <div className='text-slate-600'>  {order.amount}</div></div>
                    <div className='flex gap-1'><div className='whitespace-nowrap'>Payment Status:</div> <div className='text-slate-600'>  PAID</div></div>
                    <div className='flex gap-1'><div className='whitespace-nowrap'>Order Status:</div> <div className='text-green-400'>APPROVED</div></div>
                    <div className='flex gap-1'><div className='whitespace-nowrap'> Delievery Address: </div> <div className='text-green-400'>{order.address}</div></div>
                </div>
            </div>
            <Link href={"/profile/My_Orders"}><div className='text-xs text-center underline cursor-pointer'>Go to orders</div></Link>
        </div>
    )
}

export default page
