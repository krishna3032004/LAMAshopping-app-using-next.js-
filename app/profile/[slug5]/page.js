'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { fetchProductforwishlist, fetchProductfororder, removeproductfromwishlist, fetchUser, updateProfilefull } from '@/actions/useraction'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const MODE = {
    wishlist: "My Wishlist",
    orders: "My Orders",
    order: "My Order",
    notification: "Notification",
    profile: "Profile Information"
}
const Page = ({ params }) => {
    const { data: session, status } = useSession()
    const [gender, setGender] = useState("");
    const [info, setinfo] = useState("")
    const [edit, setedit] = useState(false)
    const [form, setform] = useState([])
    const [burger, setburger] = useState(false)
    const router = useRouter()
    const [orderproducts, setorderproducts] = useState([])
    const [orderproduct, setorderproduct] = useState({})
    const [wishlistproducts, setwishlistproducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    // const [form, setform] = useState({ username: "", email: "", gender: ""})

    useEffect(() => {
        if (status === "loading") {
            // Wait until session is loaded

            return;
        }

        if (session) {
            getdata()
        } else {
            router.push("/login")
        }
    }, [session, status])

    const getdata = async () => {
        let a = params.slug5
        let z = a.replaceAll("_", " ")
        setinfo(z)
        let b = await fetchUser(session.user.email)

        let x = await fetchProductforwishlist(b.wishlist)
        let y = JSON.parse(x);
        y.reverse()
        setwishlistproducts(y)



        let l = await fetchProductfororder(b.order)
        let m = JSON.parse(l);
    
        m.reverse()
        setorderproducts(m)



        setform(b)


        setIsLoading(false)
    }

    const retrieveorderdetail = async (produc) => {
        setorderproduct(produc)
        setinfo("My Order")
    }
    const handleSubmit = async () => {
        toast.dismiss();
        setedit(false)
        await updateProfilefull(form)
        toast.dismiss();
        toast.success('Saved!', {
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

    const handlechange = (e) => {
        // setform({...form,[e.target.name]: e.target.type === "radio" ? e.target.checked : e.target.value // Handle checkbox input for boolean
        // });
        // setform({ ...form, [e.target.name]: e.target.value })
        setform((prev) => ({
            ...prev, [e.target.name]: e.target.value, // Dynamically update the correct field
        }));
    }
    const removeitem = async (productid) => {

        toast.dismiss();
        //   let b = await fetchCart(session.user.email)
        let b = await removeproductfromwishlist(session.user.email, productid)
        let a = JSON.parse(b);
        let x = await fetchProductforwishlist(a)
        let y = JSON.parse(x);
        //   let y =JSON.parse(x);
        setwishlistproducts(y)
        toast.dismiss();
        toast.success('Removed from your Wishlist!', {
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
        // setcart(a)
    }
    return (

        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                stacked
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                limit={3}
            />
            {/* Same as */}
            {/* <ToastContainer /> */}
            {isLoading ? <div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay muted loop="loop" type="video/mp4"></video></div>
                :

                <div className='flex px-[2vw] lg:px-[4.2vw] bg-slate-200 py-[2vh] justify-evenly'>
                    <div className={` lg:w-[22.2vw] md:h-[77vh] md:static absolute ease-in-out transition-all w-60 ${burger ? "left-2" : "-left-60"}    h-full   shadow-sm shadow-slate-300 bg-white`}>
                        <div className='text-lg  font-normal p-[1vw] text-blue-400 flex gap-5 items-center'>
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="" />
                            <div >
                                <div className='text-xs text-gray-600'>Hello,</div>
                                <div className='font-semibold pt-[0.5vh] text-black'>{form.username}</div>
                            </div>
                        </div>
                        <div className='border-[1.2vh]'></div>

                        <div className='flex items-center hover:bg-slate-50 pl-[2vw]'>
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDIyIDIxIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjY5NCAtMTApIj48cGF0aCBmaWxsPSIjMjg3NEYwIiBkPSJNMTQuMjc1IDIyLjcwNGMyLjI3Mi0uNDEyIDQuMzQ3LS42MTggNi4yMjUtLjYxOCAxLjg3OCAwIDMuOTUzLjIwNiA2LjIyNS42MThhNS4xNSA1LjE1IDAgMCAxIDQuMjMgNS4wNjhWMzFoLTIwLjkxdi0zLjIyOGE1LjE1IDUuMTUgMCAwIDEgNC4yMy01LjA2OHptMS4yNzQtNy43MjRjMC0yLjU4IDIuMTYzLTQuNjczIDQuODMyLTQuNjczIDIuNjY3IDAgNC44MyAyLjA5MiA0LjgzIDQuNjczIDAgMi41OC0yLjE2MyA0LjY3My00LjgzIDQuNjczLTIuNjcgMC00LjgzMy0yLjA5Mi00LjgzMy00LjY3M3oiLz48ZWxsaXBzZSBjeD0iMjAuNTU3IiBjeT0iMjAiIHJ4PSIyMC41NTciIHJ5PSIyMCIvPjwvZz48L3N2Zz4=" alt="" />
                            <div onClick={() => {
                                setinfo("Profile Information")
                                setburger(false)
                            }
                            } className="block px-4 py-[2vh] sm:py-[3vh] pr-[3.5vw]  text-gray-700   hover:text-blue-400  cursor-pointer ">Profile Information</div>
                        </div>
                        <div className='flex items-center hover:bg-slate-50 pl-[2vw]  border-t-[0.2vh] border-gray-200'>
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDI0IDE4Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04LjY5NCAtMTEpIj48ZWxsaXBzZSBjeD0iMjAuNTU3IiBjeT0iMjAiIHJ4PSIyMC41NTciIHJ5PSIyMCIvPjxwYXRoIGZpbGw9IiMyODc0RjEiIGQ9Ik05IDExdjE3LjEwOGMwIC40OTMuNDEuODkyLjkxOC44OTJoNC45M3YtNS4yNTdoLTMuMDMzbDQuOTEyLTQuNzcgNC45NzIgNC44M2gtMy4wMzVWMjloMTIuNDE3Yy41MDcgMCAuOTE4LS40LjkxOC0uODkyVjExSDl6Ii8+PC9nPjwvc3ZnPg==" alt="" />
                            <div onClick={() => {
                                setinfo("My Orders")
                                setburger(false)
                            }} className=" pl-4 py-[2vh] sm:py-[3vh] pr-[5.5vw] text-gray-700  hover:text-blue-400  cursor-pointer ">My Orders</div>
                        </div>

                        <div className='flex items-center hover:bg-slate-50 pl-[2vw] border-t-[0.2vh] border-gray-200'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="" width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill="#2874F0" className="" stroke="#FFF" fillRule="evenodd" opacity=".9"></path></svg>
                            <div onClick={() => {
                                setinfo("My Wishlist")
                                setburger(false)
                            }} className=" px-4  py-[2vh] sm:py-[3vh] pr-[5.5vw] text-gray-700  hover:text-blue-400  cursor-pointer  ">Wishlist</div>
                        </div>
                        <div className='flex items-center hover:bg-slate-50 pl-[2vw] border-t-[0.2vh] border-gray-200'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="" viewBox="0 0 12 14"><g fill="none" fillRule="evenodd"><path d="M-4-3h20v20H-4z"></path><path fill="#2874F1" d="M6.17 13.61c-1.183 0-1.922-.723-1.922-1.88H8.09c0 1.157-.74 1.88-1.92 1.88zm4.222-5.028l1.465 1.104v1.07H0v-1.07l1.464-1.104v-2.31h.004c.035-2.54 1.33-4.248 3.447-4.652V.992C4.915.446 5.37 0 5.928 0c.558 0 1.014.446 1.014.992v.628c2.118.404 3.412 2.112 3.446 4.65h.004v2.312z"></path></g></svg>
                            <div onClick={() => {
                                setinfo("Notification")
                                setburger(false)
                            }} className="block px-4  py-[2vh] sm:py-[3vh] pr-[5.5vw] text-gray-700  hover:text-blue-400  cursor-pointer  ">Notifications</div>
                        </div>
                        <div onClick={() => {
                            signOut()
                            setburger(false)
                        }} className='cursor-pointer flex items-center hover:bg-slate-50 pl-[2vw] border-t-[0.2vh] border-gray-200'>
                            <svg width="24" height="24" className="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#2874F0" strokeWidth="0.3" stroke="#2874F0" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>
                            <div className="block px-4 py-[2vh] sm:py-[3vh] pr-[5.5vw] text-gray-700  hover:text-blue-400  cursor-pointer  ">Logout</div>
                        </div>


                        <div className=' border-[1.5vh]'></div>
                        <div className='text-xs p-[2vh] font-semibold'>Frequently Visited:</div>
                        <div className='flex gap-[1.5vw] text-xs pl-[2vh] text-gray-500'>
                            <div>Track Order</div>
                            <div>Help Center</div>
                        </div>
                        {/* <div className=' h-[42vh] shadow-sm shadow-slate-300 bg-slate-50 '>
            </div> */}
                        {/* <div className='w-[25vw] text-sm py-[3vh] flex'>
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" alt="" />
                        Safe and Secure Payments.Easy returns.100% Authentic products.</div> */}
                    </div>
                    <div onClick={()=> setburger(false)} className='w-full md:w-[59vw] min-h-[84.5vh] mb-2 rounded-lg shadow-slate-300 bg-white'>
                        <div className='flex justify-between items-center '>
                            <div className='text-lg pl-[2.5vw] font-semibold p-[1vw] border-b-[0.2vh] border-gray-200 py-[3vh]'>{info}</div>
                            {/* <div onClick={() => setburger(!burger)} className='bg-red-400 cursor-pointer'>home</div> */}
                            <img onClick={() => setburger(!burger)} className='md:hidden w-10 pr-3 h-10' src="https://cdn.iconscout.com/icon/free/png-512/free-hamburger-menu-icon-download-in-svg-png-gif-file-formats--crispy-user-interface-pack-icons-462145.png?f=webp&w=256" alt="" />
                        </div>

                        <div className='border-b-[0.2vh] border-gray-200 '></div>
                        {/* <div className='w-[65vw] bg-zinc-400 h-[0.1vh]'></div> */}
                        {info === MODE.wishlist && (wishlistproducts.length === 0 ?
                            <div className='flex flex-col mt-[10vh] justify-center items-center'>
                                <img className='w-[15vw]' src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" alt="" />
                                <div className='mt-[2vh] font-semibold'>Empty Wishlist</div>
                                <div className='text-xs my-[2vh]'>You have no items in your wishlist. Start adding!</div>

                            </div>
                            :

                            wishlistproducts.map((produc, index) => {
                                // setcount(cart[index].quantity)
                                return <div key={index} className='flex gap-7 p-[1.5vw]  border-b-[0.2vh] border-gray-200'>

                                    <div className='w-[20vw] sm:w-[13vw] lg:w-[10vw] flex flex-col justify-center'>
                                        <Link href={`/product/${produc._id}`}><img className='h-[13vh] sm:h-[15vh] lg:h-[20vh]  object-cover overflow-hidden cursor-pointer' src={produc.image} alt="" /></Link>
                                        <div onClick={() => removeitem(produc._id)} className='md:hidden  cursor-pointer font-semibold p-[1vw] px-[2vw] text-red-400 hover:text-red-700'>Remove</div>
                                    </div>
                                    <div className='md:w-[44vw]'>
                                        <div className='flex justify-between'>
                                            <Link href={`/product/${produc._id}`}><div className='py-[1vh] hover:text-blue-400 cursor-pointer'>{produc.name}</div></Link>
                                            <div onClick={() => removeitem(produc._id)} className='md:block hidden cursor-pointer font-semibold p-[1vw] px-[2vw] text-red-400 hover:text-red-700'>REMOVE</div>
                                        </div>
                                        <div className='flex gap-5 items-center'>
                                            <div className='line-through text-slate-500'>₹{produc.old_amount}</div>
                                            <div className='text-xl'>₹{produc.amount}</div>
                                        </div>


                                        {produc.quantity < 1 ? <div className='text-lg text-red-400 mt-[1vh]'>Not Available</div> :
                                            <div className='text-lg text-blue-400 mt-[1vh]'>Available</div>}
                                        {/* <div className='cursor-pointer font-semibold p-[1vw] hover:text-blue-500'>REMOVE</div> */}
                                    </div>
                                </div>
                            }
                            )

                        )
                        }
                        {info === MODE.profile &&
                            <div>
                                <form action={handleSubmit}>
                                    <div className='text-blue-400 flex items-center justify-center py-[2vh]'>
                                        {edit === true ? <div className='flex items-center gap-[2vw]'>
                                            <button type="submit" disabled={!form.username || !form.email || !form.gender} className='bg-blue-400 text-white px-[2vh] py-[1vh]'>SAVE</button>
                                            <div onClick={() => setedit(false)} className='cursor-pointer'>Cancel</div>
                                        </div>
                                            :
                                            <div onClick={() => setedit(true)} className='py-[2vh] cursor-pointer'>Edit</div>}
                                    </div>
                                    <div className='mx-[5vw]'>
                                        <div className='my-[1.5vh] font-semibold'>Username</div>
                                        <input type="text" disabled={edit === false} className='outline-none md:w-[30vw] sm:w-[45vw] w-56 border-[0.1vw] bg-slate-50 py-[1vh] px-[0.5vw] text-black disabled:text-slate-500' value={form.username ? form.username : ""} onChange={handlechange} name='username' placeholder='Username' />
                                    </div>

                                    <div className='mx-[5vw] mt-[4vh]'>
                                        <div className='my-[1.5vh] font-semibold'>Your Gender</div>
                                        <label className=' text-slate-500 mr-[10vw] sm:mr-[2vw]'>
                                            <input className='mr-[1vw]' disabled={edit === false} type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handlechange} />
                                            Male
                                        </label>
                                        <label className=' text-slate-500'>
                                            <input className='mr-[1vw]' disabled={edit === false} type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handlechange} />
                                            Female
                                        </label>
                                    </div>
                                    <div className='mx-[5vw] mt-[3vh]'>
                                        <div className='my-[1.5vh] font-semibold'>Email Address</div>
                                        <input type="text" disabled={true} className='outline-none md:w-[30vw] sm:w-[45vw] w-56 border-[0.1vw] bg-slate-50 py-[1vh] px-[0.5vw] text-black disabled:text-slate-500' value={form.email ? form.email : ""} name='email' placeholder='Email' />
                                    </div>
                                </form>

                                <div className='mx-[5vw] mt-[15vh]'>
                                    <div className='font-semibold mb-[2vh]'>FAQs</div>
                                    <div className='font-semibold text-xs sm:text-sm'>What happens when I update my email address?</div>
                                    <div className=' pt-[3vh] text-xs sm:text-sm '>{"Your login email id changes, likewise. You'll receive all your account related communication on your updated email address."}</div>
                                    <div className='font-semibold pt-[3vh] text-xs sm:text-sm '>When will my Flipkart account be updated with the new email address?</div>
                                    <div className=' pt-[3vh] text-xs sm:text-sm '>It happens as soon as you confirm the verification code sent to your email and save the changes.</div>
                                    <div className='font-semibold pt-[3vh] text-xs sm:text-sm '>What happens to my existing Flipkart account when I update my email address?</div>
                                    <div className=' pt-[3vh] text-xs sm:text-sm '>{"Updating your email address doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details."}</div>
                                    <div className='font-semibold pt-[3vh] text-xs sm:text-sm '>Does my Seller account get affected when I update my email address?</div>
                                    <div className=' pt-[3vh] text-xs sm:text-sm '>{"Flipkart has a 'single sign-on' policy. Any changes will reflect in your Seller account also."}</div>
                                </div>
                                <div>
                                    <img width="100%" src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myProfileFooter_4e9fe2.png" alt="" />
                                </div>


                            </div>
                        }
                        {info === MODE.orders && (orderproducts.length === 0 ?
                            <div className='flex flex-col mt-[5vh] justify-center items-center'>
                                <img className='w-[15vw]' src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="" />
                                <div className='mt-[2vh]'>Empty Orderlist!</div>
                                <div className='text-xs my-[2vh]'>You have no items in your orderlist. Start ordering!</div>

                            </div>
                            :
                            orderproducts.map((produc, index) => {
                                // setcount(cart[index].quantity)
                                return <div key={index} className='flex gap-7 p-[1.5vw]  border-b-[0.2vh] border-gray-200'>
                                    <div className='w-[25vw] md:w-[15vw] lg:w-[10vw] flex justify-center'>
                                        <img onClick={() => retrieveorderdetail(produc)} className='h-[13vh] md:h-[20vh] object-cover overflow-hidden cursor-pointer' src={produc.image} alt="" /></div>
                                    <div className='w-[50vw]'>
                                        <div className='flex justify-between'>
                                            <div onClick={() => retrieveorderdetail(produc)} className='py-[1vh] hover:text-blue-400 cursor-pointer'>{produc.name}</div>
                                            {/*  onClick={() => retrieveorderdetail(produc)} <div onClick={() => removeitem(produc._id)} className='cursor-pointer font-semibold p-[1vw] px-[2vw] text-red-400 hover:text-red-700'>REMOVE</div> */}
                                        </div>
                                        <div className='flex gap-5 items-center'>
                                            {/* <div className='line-through text-slate-500'>₹{produc.old_amount}</div> */}
                                            <div className='text-xl'>₹{produc.amount}</div>
                                        </div>

                                        {/* <div className='text-lg text-blue-400 mt-[1vh]'>Available</div> */}
                                        {/* <div className='cursor-pointer font-semibold p-[1vw] hover:text-blue-500'>REMOVE</div> */}
                                    </div>
                                </div>
                            }
                            )
                        )
                        }
                        {info === MODE.order &&
                            // setcount(cart[index].quantity)
                            <div className='flex flex-col gap-7 p-[1.5vw]  border-b-[0.2vh] border-gray-200'>
                                <div className="md:w-[55vw] w-full mx-auto p-6 bg-slate-100 shadow-lg rounded-lg mt-6">
                                    {/* Customer Details */}
                                    <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>
                                    <div className=" mb-6">
                                        <p className="text-gray-700 font-semibold mb-[2vh]">{orderproduct.customername},</p>
                                        <div className='flex flex-wrap'>
                                            <p className="text-gray-700 md:w-[20vw]">{orderproduct.address} </p>

                                        </div>
                                        <h2 className="pt-[3vh] font-semibold mb-[1vh]">Phone number</h2>
                                        <p className="text-gray-700">{orderproduct.phone}</p>
                                    </div>
                                </div>
                                <div className='md:w-[55vw] gap-7 p-[1.5vw] flex mx-auto bg-slate-100 shadow-lg rounded-lg mt-4'>
                                    <div className='w-[25vw] md:w-[15vw] lg:w-[10vw] flex justify-center'>
                                        <Link href={`/product/${orderproduct._id}`}><img className='h-[13vh] md:h-[20vh]  object-cover overflow-hidden cursor-pointer' src={orderproduct.image} alt="" /></Link>
                                    </div>
                                    <div className='w-[50vw]'>
                                        <div className='flex justify-between'>
                                            <Link href={`/product/${orderproduct._id}`}><div className='py-[1vh] hover:text-blue-400 cursor-pointer'>{orderproduct.name}</div></Link>
                                            {/* <div onClick={() => removeitem(produc._id)} className='cursor-pointer font-semibold p-[1vw] px-[2vw] text-red-400 hover:text-red-700'>REMOVE</div> */}
                                        </div>
                                        <div className='flex gap-5 items-center'>
                                            {/* <div className='line-through text-slate-500'>₹{produc.old_amount}</div> */}
                                            <div className='text-xl'>₹{orderproduct.amount}</div>
                                        </div>

                                        {/* <div className='text-lg text-blue-400 mt-[1vh]'>Available</div> */}
                                        {/* <div className='cursor-pointer font-semibold p-[1vw] hover:text-blue-500'>REMOVE</div> */}
                                    </div>
                                </div>
                            </div>



                        }
                        {info === MODE.notification &&
                            <div className='flex flex-col mt-[10vh] justify-center items-center'>
                                <img className='w-[15vw]' src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/emptyNotifications_4472f7.png" alt="" />
                                <div className='mt-[2vh] font-semibold'>All caught up!</div>
                                <div className='text-xs my-[2vh]'>There are no new notifications for you.</div>

                            </div>
                        }
                        {/* <div className='w-[65vw] border-[0.1vh]'></div> */}

                    </div>




                </div>
            }
        </div>

    )
}

export default Page
