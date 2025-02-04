"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { getorder, fetchCart, decreaseproduct, sendReviewEmail } from '@/actions/useraction'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Page = ({ params }) => {
    const [order, setorder] = useState({})
    const { data: session, status } = useSession()
     const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()
    const [isitem, setisitem] = useState(true)
    useEffect(() => {
        if (status === "loading") {
            return;
        }
        if (session) {

            let a = params.slug3
            let b = a.split("?")[0]
            getdata(b)
            setisitem(false)
            setIsLoading(false)
        }else{
            router.push("/login")
        }
    }, [status, session])

    const getdata = async (oid) => {
        try{

        
        let a = await getorder(oid)
        
        
        setorder(a)



        let x = await fetchCart(a.email)
        
        let y = JSON.parse(x);
        await sendReviewEmail(a.email,y)
        let b = await decreaseproduct(y,a.email,oid)
        } catch(e){
            console.log(e)
        }
    }

    return (
        <>
        {isLoading ? <div className='flex justify-center  items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay muted loop="loop" type="video/mp4"></video></div>
            :
        <div className='flex justify-center gap-2 my-[10vh] flex-col items-center'>
            {isitem ? <div className='shadow-lg shadow-slate-300 text-red-500 md:w-[35vw] bg-slate-100 px-[6vw] py-[5vh]'>There is no order for this orderid</div>
            :
            <div className='shadow-lg shadow-slate-300 md:w-[35vw] bg-slate-100 px-[6vw] py-[5vh]'>
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
            </div>}
            <Link href={"/profile/My_Orders"}><div className='text-xs text-center underline cursor-pointer'>Go to orders</div></Link>
        </div>
        }
        </>
    )
}

export default Page
