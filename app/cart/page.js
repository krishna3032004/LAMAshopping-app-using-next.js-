"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { fetchCart, fetchProductbyid, initiatepayment } from '@/actions/useraction'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { removeproductfromcart } from '@/actions/useraction'
import { changequantityfromcart } from '@/actions/useraction'
import Link from 'next/link'
import Script from 'next/script'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const Page = () => {
    const [cart, setcart] = useState([])
    const [products, setproducts] = useState([])

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [form, setform] = useState({
        name: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
        address: "",
    })
    const [payment, setpayment] = useState(false)
    const [payment2, setpayment2] = useState(false)
    const { data: session, status } = useSession()
    const router = useRouter()
    let z = []
    const [count, setcount] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [totalprice, settotalprice] = useState()
    const [items, setitems] = useState()
    let isFormComplete = true
    // useEffect(() => {
    //     if (status === "loading") {
    //         // Wait until session is loaded
    //         setIsLoading(true)

    //         // return;
    //     } else {
    //         if (session) {
    //             getcart()
    //             isFormComplete = false

    //         }
    //         else if(status!="loading") {
    //             router.push("/login")
    //         }

    //     }
    // }, [status, session])

    useEffect(() => {
        if (status === "loading") {
            setIsLoading(true);
            return; // Stop execution until session is loaded
        }

        if (session) {
            getcart();
            isFormComplete = false;
        } else {
            // Only push to login if session is explicitly null/undefined
            if (status === "unauthenticated") {
                router.push("/login");
            }
        }
    }, [status, session]);

    // useEffect(() => {
    //     if (searchparam.get("paymentdone") == "true") {
    //         toast.success('Payment done Successfully!', {
    //             position: "bottom-right",
    //             autoClose: 3000,
    //             hideProgressBar: true,
    //             stacked: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "colored",
    //         });
    //     }

    // }, [])



    const getcart = async () => {
        let b = await fetchCart(session.user.email)
        let a = JSON.parse(b);
        a.reverse()

        let x = await fetchProductbyid(a)
        let y = JSON.parse(x);

        setproducts(y)
        let sum = 0
        let items = 0

        for (let value in y) {
            sum = sum + a[value].quantity * y[value].amount
            items = items + a[value].quantity
        }
        setitems(items)
        settotalprice(sum)
        setcart(a)
        setIsLoading(false);
    }


    const verifyproducts = async () => {
        toast.dismiss();
        const invalidItems = cart.filter(cartItem => {
            const product = products.find(product => product._id === cartItem.product);
            return product && cartItem.quantity > product.quantity; // Check the condition
        });

        if (invalidItems.length > 0) {
            toast.warning('Remove those products which is NOT AVAILABLE!', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                stacked: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
        else {
            setpayment(true)
        }
    }


    const removeitem = async (productid) => {

        toast.dismiss();
        let item = 0
        let totaprice = 0
        let b = await removeproductfromcart(session.user.email, productid)
        let a = JSON.parse(b);
        let product = []
        let car = []
        product = products.filter(product => product._id !== productid);
        car = cart.filter(item => item.product !== productid);
        setproducts(product)
        setcart(car)

        toast.success('Removed from your Cart!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            stacked: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        for (let i of car) {
            item = item + i.quantity
        }
        for (let value of car) {
            let priceproduct = products.filter(i => i._id === value.product)
            totaprice = totaprice + value.quantity * priceproduct[0].amount
        }
        settotalprice(totaprice)

        setitems(item)
    }
    const countchange = async (id, oper) => {
        toast.dismiss()
        let c = []
        let totaprice = 0
        let item = 0
        if (oper === 0) {
            c = cart.map(item => {
                if (item.product === id) {
                    toast.success(`You've changed  QUANTITY to '${item.quantity - 1}'!`, {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        stacked: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
            setcart(c)
            //   c.reverse()
            let a = await changequantityfromcart(c, session.user.email)
            //   c.reverse()


        }
        else {
            c = cart.map(item => {
                if (item.product === id) {
                    toast.success(`You've changed  QUANTITY to '${item.quantity + 1}'!`, {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        stacked: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            let a = await changequantityfromcart(c, session.user.email)
            setcart(c)

        }
        for (let i of c) {
            item = item + i.quantity
        }
        for (let value of c) {
            let priceproduct = products.filter(i => i._id === value.product)
            totaprice = totaprice + value.quantity * priceproduct[0].amount
        }
        settotalprice(totaprice)
        setitems(item)
        // reloadPage('/cart')
    }
    const pay = async (amount) => {
        // if (session) {
        // if (paymentform.name && paymentform.message) {
        try {
            let amount2 = Number.parseInt(amount);
            let a = await initiatepayment(amount2, session.user.email, form);
            setIsLoading(true);

            let orderID = a.id;
            var options = {
                "key_id": process.env.NEXT_PUBLIC_KEY_ID, // Razorpay Key ID
                "amount": amount2, // Convert amount to paisa (INR subunit)
                "currency": "INR",
                "name": "Opulenza", // Business name
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id": orderID, // Order ID from backend response
                "callback_url": `${process.env.NEXT_PUBLIC_URL2}/api/razorpay`,
                "prefill": {
                    "name": session.user.name, // Use actual session user name
                    "email": session.user.email,
                    "contact": "9000090000"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                },
                "modal": {
                    "ondismiss": function () {
                        console.log("Payment cancelled by user!");
                        toast.warning('Payment was cancelled! Try again', {
                            position: "bottom-right",
                            autoClose: 3000,
                            hideProgressBar: true,
                            stacked: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                        });
                        setTimeout(() => {
                            window.location.href = `/product/${params.slug1}`; // Redirect user to home page

                        }, 2000);
                    }
                }
            };

            var rzp1 = new window.Razorpay(options);

            rzp1.open();

        } catch (error) {
            console.error("Error in payment:", error);
            alert("Something went wrong with the payment. Please try again.");
        }



    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setform((prevform) => ({
            ...prevform,
            [name]: value,
        }));
    };

    isFormComplete = Object.values(form).every((value) => value.trim() !== "");

    const [deliveryMethod, setDeliveryMethod] = useState("Free Shipping");

    // const isFormComplete = Object.values(form).every((value) => value.trim() !== "");

    const handleContinue = () => {
        if (!isFormComplete) {
            // alert("Please fill in all details before continuing.");
            toast.warning('Please fill all details before continuing!', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                stacked: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }
    };



    const handleSubmit = () => {
        // e.preventDefault();
        console.log("Form Data Submitted:", form);
        setpayment2(true)
    };
    const reloadPage = (url) => {
        window.location.href = url;
    };
    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                stacked
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {/* Same as */}
            {/* <ToastContainer /> */}


            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <div>
                {isLoading ? <div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay muted loop="loop" type="video/mp4"></video></div>
                    :
                    <div className=' block md:flex px-[2vw] bg-slate-200 py-[2vh] justify-evenly'>
                        {payment === true ? (
                            payment2 === true ? <div className="md:w-[65vw] w-full mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
                                {/* Customer Details */}
                                <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>
                                <div className=" mb-6">
                                    <p className="text-gray-700">{form.name},</p>
                                    <div className='flex flex-wrap'>
                                        <p className="text-gray-700">{form.address},{form.city},{form.state} {form.postalCode},{form.country} </p>

                                    </div>
                                    <h2 className="pt-[3vh] font-semibold mb-[1vh]">Phone number</h2>
                                    <p className="text-gray-700">{form.phone}</p>
                                </div>

                                {/* Delivery Details */}
                                <h2 className=" font-semibold mt-8 mb-4">Delivery Method</h2>
                                <div className="flex items-center gap-4 mb-6">
                                    <input
                                        type="radio"
                                        id="free-shipping"
                                        name="deliveryMethod"
                                        value="Free Shipping"
                                        checked={deliveryMethod === "Free Shipping"}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor="free-shipping" className="text-gray-700">
                                        Free Shipping
                                    </label>
                                </div>

                                {/* Continue Button */}
                                {/* <button
                                    onClick={() => pay(totalprice)}
                                    disabled={!isFormComplete}
                                    className={`w-full py-2 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFormComplete ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Place Order & Pay
                                </button> */}
                                <button
                                    onClick={async () => {
                                        setIsButtonDisabled(true);
                                        pay(totalprice)
                                    }}
                                    disabled={!isFormComplete || isButtonDisabled}
                                    className={`w-full py-2 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFormComplete && !isButtonDisabled ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Place Order & Pay
                                </button>
                            </div> :

                                <form
                                    action={handleSubmit}
                                    className="md:w-[65vw] mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg"
                                >
                                    {/* Customer Details */}
                                    <h2 className="text-2xl font-semibold mb-4">Customer Details</h2>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    </div>

                                    {/* Delivery Details */}
                                    <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <select
                                                name="country"
                                                value={form.country}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select Country</option>
                                                <option value="India">India</option>
                                                <option value="USA">USA</option>
                                                <option value="Canada">Canada</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <select
                                                name="state"
                                                value={form.state}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select State</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                <option value="California">California</option>
                                                <option value="Ontario">Ontario</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <select
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select City</option>
                                                <option value="Gwalior">Gwalior</option>
                                                <option value="Mumbai">Mumbai</option>
                                                <option value="Los Angeles">Los Angeles</option>
                                                <option value="Toronto">Toronto</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={form.postalCode}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter your postal code"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter your address"
                                            rows="3"
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={!isFormComplete}
                                        className={`w-full py-2 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFormComplete ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Continue
                                    </button>
                                </form>)

                            :

                            <div className=' min-h-[88vh] mb-2 rounded-lg shadow-slate-300 bg-white'>
                                <div className='text-lg pl-[3vw] font-semibold p-[1vw] text-blue-400'>Add to Cart</div>
                                <div className=' border-[0.9vh]'></div>
                                <div className='min-h-[66vh]'>
                                    {cart.length != 0 ?

                                        products.map((produc, index) => {
                                            // setcount(cart[index].quantity)
                                            return <div key={index}>
                                                <div className=' md:flex hidden gap-7 p-[1.5vw]'>
                                                    <div className='md:w-[12vw] w-[26vw] flex justify-center'>
                                                        <Link href={`/product/${produc._id}`} ><img className='h-[38vw] md:h-[30vh] object-cover overflow-hidden cursor-pointer' src={produc.image} alt="" /></Link></div>
                                                    <div className='md:w-[50vw] text-sm w-[63vw]'>
                                                        <div className='flex justify-between'>
                                                            <Link href={`/product/${produc._id}`}><div className='py-[1vh] hover:text-blue-400 cursor-pointer'>{produc.name}</div></Link>
                                                            <div onClick={() => removeitem(produc._id)} className='cursor-pointer font-semibold p-[1vw] px-[2vw] text-red-400 hover:text-red-700'>REMOVE</div>
                                                        </div>
                                                        <div className='flex gap-5 items-center'>
                                                            <div className='line-through  text-slate-500'>₹{produc.old_amount}</div>
                                                            <div className='text-xl '>₹{produc.amount}</div>
                                                        </div>
                                                        <div className='flex my-[2vh] items-center'>
                                                            <div>Quantity: </div>
                                                            <div onClick={() => { cart[index].quantity !== 1 ? (countchange(cart[index].product, 0)) : "" }} className={`${cart[index].quantity === 1 ? "text-gray-300" : "text-black"} bg-gray-200 cursor-pointer px-4 text-lg rounded-l-full `}>-</div>
                                                            <div className='text-sm px-[1vw]'>{cart[index].quantity}</div>
                                                            <div onClick={() => {
                                                                cart[index].quantity <= produc.quantity ? (countchange(cart[index].product, 1)) : ""
                                                            }} className={`${cart[index].quantity > produc.quantity ? "text-gray-300" : "text-black"} bg-gray-200 cursor-pointer px-4  text-lg rounded-r-full `}>+</div></div>
                                                        {produc.quantity < 1 && <div className='text-xs text-red-400 mt-[1vh]'>Out of Stock</div>}
                                                        {(produc.quantity < cart[index].quantity && produc.quantity > 0) && <div className='text-xs text-red-400 mt-[1vh]'>only {produc.quantity} is available</div>}
                                                        {produc.quantity < cart[index].quantity ? <div className='text-sm text-red-400 mt-[1vh]'>Not Available</div> : <div className='text-sm text-blue-400 mt-[1vh]'>Available</div>}
                                                        {/* <div className='cursor-pointer font-semibold p-[1vw] hover:text-blue-500'>REMOVE</div> */}
                                                    </div>
                                                </div>
                                                <div className='flex border-b-[0.1vh] border-gray-400  md:hidden gap-7 p-[1.5vw]'>
                                                    <div className=' w-[20vw]  justify-center'>
                                                        <Link href={`/product/${produc._id}`} ><img className='h-[30vw] md:h-[30vh] object-cover overflow-hidden cursor-pointer' src={produc.image} alt="" /></Link>
                                                        <div onClick={() => removeitem(produc._id)} className='cursor-pointer text-center font-semibold p-[1vw] px-[2vw] text-red-400 hover:text-red-700'>Remove</div>
                                                    </div>
                                                    <div className='md:w-[50vw] text-sm w-[63vw]'>
                                                        <div className='flex justify-between'>
                                                            <Link href={`/product/${produc._id}`}><div className='py-[1vh] hover:text-blue-400 cursor-pointer'>{produc.name}</div></Link>
                                                        </div>
                                                        <div className='flex gap-5 items-center'>
                                                            <div className='line-through  text-slate-500'>₹{produc.old_amount}</div>
                                                            <div className='text-xl '>₹{produc.amount}</div>
                                                        </div>
                                                        <div className='flex my-[2vh] items-center'>
                                                            <div>Quantity: </div>
                                                            <div onClick={() => { cart[index].quantity !== 1 ? (countchange(cart[index].product, 0)) : "" }} className={`${cart[index].quantity === 1 ? "text-gray-300" : "text-black"} bg-gray-200 cursor-pointer px-4 text-lg rounded-l-full `}>-</div>
                                                            <div className='text-sm px-[1vw]'>{cart[index].quantity}</div>
                                                            <div onClick={() => {
                                                                cart[index].quantity <= produc.quantity ? (countchange(cart[index].product, 1)) : ""
                                                            }} className={`${cart[index].quantity > produc.quantity ? "text-gray-300" : "text-black"} bg-gray-200 cursor-pointer px-4  text-lg rounded-r-full `}>+</div></div>
                                                        {produc.quantity < 1 && <div className='text-xs text-red-400 mt-[1vh]'>Out of Stock</div>}
                                                        {(produc.quantity < cart[index].quantity && produc.quantity > 0) && <div className='text-xs text-red-400 mt-[1vh]'>only {produc.quantity} is available</div>}
                                                        {produc.quantity < cart[index].quantity ? <div className='text-sm text-red-400 mt-[1vh]'>Not Available</div> : <div className='text-sm text-blue-400 mt-[1vh]'>Available</div>}
                                                        {/* <div className='cursor-pointer font-semibold p-[1vw] hover:text-blue-500'>REMOVE</div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        )
                                        :
                                        <div className='flex flex-col mt-[5vh] justify-center items-center'>
                                            <img className='w-[15vw]' src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="" />
                                            <div className='mt-[2vh]'>Your cart is empty!</div>
                                            <div className='text-xs my-[2vh]'>Add items to it now.</div>
                                            <Link href={"/"}><div className='px-[6vw] cursor-pointer bg-blue-500 text-center text-white py-[1vh] mt-[0.5]'>Shop now</div></Link>
                                        </div>
                                    }

                                    {cart.length != 0 &&
                                        <div className='  md:hidden sticky top-[12vh]'>
                                            <div className='  shadow-sm shadow-slate-300 bg-slate-50 '>
                                                <div className='px-[2vw] py-[1vh] font-semibold text-slate-500'>Price Details</div>
                                                <div className=' border-[0.1vh]'></div>
                                                <div className='flex justify-between px-[2vw] py-[2vh] text-slate-800'>
                                                    <div>Price({items} item)</div>
                                                    <div>₹{totalprice}</div>
                                                </div>
                                                <div className='flex justify-between px-[2vw] pb-[2vh] text-slate-800'>
                                                    <div>Discount</div>
                                                    <div className='text-green-400'>-₹0</div>
                                                </div>
                                                <div className='flex justify-between px-[2vw] pb-[2vh] text-slate-800'>
                                                    <div>Delivery Charges</div>
                                                    <div className='text-green-400'>Free</div>
                                                </div>

                                                <div className=' m-auto border-[0.1vh]'></div>
                                                <div className='flex justify-between py-[2vh] px-[2vw] font-semibold'>
                                                    <div>Total Amount</div>
                                                    <div>₹{totalprice}</div>
                                                </div>

                                                <div className=' m-auto border-[0.1vh] '></div>
                                            </div>
                                            <div className='bg-gray-300 pl-[3vw]  items-center text-sm py-[3vh] flex'>
                                                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" alt="" />
                                                Safe and Secure Payments.Easy returns.100% Authentic products.</div>
                                        </div>}
                                </div>
                                {/* <div className='w-[65vw] border-[0.1vh]'></div> */}
                                <div className='w-[65vw] border-[0.1vh]'></div>
                                {cart.length != 0 &&
                                    <div className='flex justify-end bg-white border-t-[0.5vh] sticky bottom-0 top-16 z-10'>
                                        <div onClick={() => verifyproducts()} className='bg-orange-500 cursor-pointer text-white mr-[2vw] my-[2vh] md:my-[3vh] px-[2vw] py-[1vh]'>PLACE ORDER</div>
                                    </div>}
                            </div>}



                        {cart.length != 0 &&
                            <div className='  w-[25vw] h-[52vh] md:block hidden sticky top-[12vh]'>
                                <div className=' lg:h-[42vh] h-[34vh] shadow-sm shadow-slate-300 bg-slate-50 '>
                                    <div className='px-[2vw] py-[2vh] font-semibold text-slate-500'>PRICE DETAILS</div>
                                    <div className='w-[25vw] border-[0.1vh]'></div>
                                    <div className='flex justify-between px-[2vw] py-[2vh] lg:py-[3vh] text-slate-800'>
                                        <div>Price({items} item)</div>
                                        <div>₹{totalprice}</div>
                                    </div>
                                    <div className='flex justify-between px-[2vw] pb-[2vh] lg:pb-[3vh] text-slate-800'>
                                        <div>Discount</div>
                                        <div className='text-green-400'>-₹0</div>
                                    </div>
                                    <div className='flex justify-between px-[2vw] pb-[2vh] lg:pb-[3vh] text-slate-800'>
                                        <div>Delivery Charges</div>
                                        <div className='text-green-400'>Free</div>
                                    </div>

                                    <div className='w-[22vw] m-auto border-[0.1vh]'></div>
                                    <div className='flex justify-between py-[1vh] lg:py-[3vh] px-[2vw] font-semibold'>
                                        <div>Total Amount</div>
                                        <div>₹{totalprice}</div>
                                    </div>

                                    <div className='w-[22vw] m-auto border-[0.1vh] '></div>
                                </div>
                                <div className='w-[25vw] text-xs lg:text-sm py-[3vh] flex'>
                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" alt="" />
                                    Safe and Secure Payments.Easy returns.100% Authentic products.</div>
                            </div>}
                    </div>}
            </div>
        </>
    )
}

export default Page
