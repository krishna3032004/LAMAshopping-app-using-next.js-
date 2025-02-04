import Payment from "@/app/models/Payment";
import Razorpay from "razorpay";
import connectDB from "@/app/db/connectDB";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { NextResponse } from "next/server";
import User from "@/app/models/User";

export const POST = async(req)=>{
    await connectDB()
    let body = await req.formData()
    body = Object.fromEntries(body)

    // check if razorpayOrderID is present on the server
    let p = await Payment.findOne({oid: body.razorpay_order_id})
    if(!p){
        return NextResponse.json({success: false,message:"Order id not found"})
    }

    let user = await User.findOne({username :p.to_User })
    const Secret = process.env.NEXT_PUBLIC_KEY_SECRET

    // verify the payment
    let xx = validatePaymentVerification({"order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id}, body.razorpay_signature, Secret)

    if(xx){
        // update the payment status
        const updatePayment = await Payment.findOneAndUpdate({oid: body.razorpay_order_id},{done:"true"},{new:true})
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL2}/receipt/${updatePayment.oid}?paymentdone=true`)
    }
    else{
        return NextResponse.json({success:false, message:"Payment Verification Failed"})
    }
}
