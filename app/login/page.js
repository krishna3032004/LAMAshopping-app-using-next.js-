'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchProduct, resetPassword, updateProfile } from '@/actions/useraction'
import { registerUser, verify } from '@/actions/useraction'
import { confirmcode } from '@/actions/useraction'
import { createUser } from '@/actions/useraction'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const MODE = {
    LOGIN: "LOGIN",
    EMAIL: "EMAIL",
    REGISTER: "REGISTER",
    RESET_PASSWORD: "RESET_PASSWORD"
}

const Page = () => {
    const [mode, setmode] = useState("LOGIN")
    const [mode2, setmode2] = useState("notconfirm")
    const { data: session, status } = useSession()
    const [form, setform] = useState({ username: "", email: "", password: "", newpassword: "" })
    const [message, setmessage] = useState("")
    const [message2, setmessage2] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setform({ username: "", email: "", password: "", newpassword: "" })
        setmessage("")
        setmode2("notconfirm")
        // setIsLoading(false)
        if (status === "loading") {
            // Wait until session is loaded
            setIsLoading(true)

            return;
        }
        else {

            if (session) {
                router.push('/profile/Profile_Information')
            }
            else {
                setIsLoading(false)
            }
        }

    }, [mode, status, session])

    // const {email ,password} = form
    const [Error, setError] = useState("")
    const router = useRouter()
    useEffect(() => {
        document.title = "Login -GetMeACoffee"

    }, [])

    const getdatalogin = async () => {
        setIsLoading(true)
        let a = await verify(form.email, form.password)
        if (a) {
            setmessage(a)
            setIsLoading(false)
        }
        else {
            const result = await signIn("credentials", {
                redirect: false,
                callbackUrl: '/profile',
                email: form.email,
                password: form.password,
            });
        }

        
    }

    const registeruser = async () => {
        try {
            setIsLoading(true)
            if (!form.email) {
                setmessage("email is required")
                return false
            }
            if (!form.password) {
                setmessage("password is required")
                return false
            }
            if (!form.username) {
                setmessage("username is required")
                return false
            }
            const response = await registerUser(form.email)
            if (response === "User already exists") {
                setmessage(response)
                return false
            }
            return true
        } catch (error) {
            console.log("Registration error theek hai:", error);
        }
    };
    const resetpassword = async () => {
        setIsLoading(true)
        try {
            const response = await resetPassword(form.email)
            if (response === "User don't exists") {
                setmessage(response)
                return false
            }
            return true
        } catch (error) {
            console.error("change password error:", error);
            setError("An error occurred. Please try again.");
        }
    }
    const confirm = async () => {
        setIsLoading(true)
        toast.dismiss();
        let a = await confirmcode(form.verification)
        if (a) {
            if (mode === MODE.RESET_PASSWORD) {
                await updateProfile(form.email, form.newpassword)
                // setmessage2("Reset password")
                toast.success('Password changed!', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    stacked: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
            else if (mode === MODE.REGISTER) {
                await createUser(form.email, form.password, form.username)
                toast.success('User Created!', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        stacked: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
            }
            setform({ username: "", email: "", password: "" })
            setmode("EMAIL")
            setIsLoading(false)

        }
        else {
            toast.warning('Wrong Code!', {
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
            setIsLoading(false)
        }
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
        setmessage("")
        setmessage2("")
    }
    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                stacked
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {isLoading ? <div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay="autoplay" muted loop="loop" type="video/mp4"></video></div>
                :
                <div>
                    {(mode === MODE.LOGIN || mode === MODE.EMAIL) &&
                        <div className='text-white container mx-auto pt-32 md:pt-20 '>
                            <h1 className='text-center font-semibold text-3xl text-black'>Log In</h1>
                        </div>}
                    {mode === MODE.REGISTER &&
                        <div className='text-white container mx-auto pt-32 md:pt-20 '>
                            <h1 className='text-center font-semibold text-3xl text-black'>Register</h1>
                        </div>}
                    {mode === MODE.RESET_PASSWORD &&
                        <div className='text-white container mx-auto pt-32 md:pt-20 '>
                            <h1 className='text-center font-semibold text-3xl text-black'>Reset Your Password</h1>
                        </div>}

                    {mode === MODE.LOGIN &&
                        <div className="flex flex-col gap-2 min-h-[70.3vh] items-center pb-[20vh] md:pb-10 ">
                            <div className='py-3 flex'>New to this site?<div onClick={() => setmode("REGISTER")} className='text-blue-400 cursor-pointer'>Sign Up </div></div>
                            <button  onClick={() => {
                                setIsLoading(true)
                                signIn("google")
                            }}
                                className="flex w-[245px] items-center shadow-md max-w-xs text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-[6vw] sm:px-[4vw] lg:px-[3vw] py-2.5 text-center mb-2">
                                <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999XlinkxmlnsXlink"
                                    viewBox="-0.5 0 48 48" version="1.1">

                                    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="Color-" transform="translate(-401.000000, -860.000000)">
                                            <g id="Google" transform="translate(401.000000, 860.000000)">
                                                <path
                                                    d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                                    id="Fill-1" fill="#FBBC05"> </path>
                                                <path
                                                    d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                                    id="Fill-2" fill="#EB4335"> </path>
                                                <path
                                                    d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                                    id="Fill-3" fill="#34A853"> </path>
                                                <path
                                                    d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                                    id="Fill-4" fill="#4285F4"> </path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <span>Log in with Google</span>
                            </button>
                            <button onClick={() => {
                                setIsLoading(true)
                                signIn("github")
                            }}
                                className="flex w-[245px]  items-center shadow-md max-w-xs text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-[6vw] sm:px-[4vw] lg:px-[3vw] py-2.5 text-center mb-2">
                                <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999XlinkxmlnsXlink"
                                    viewBox="0 0 73 73" version="1.1">
                                    <g id="team-collaboration/version-control/github" stroke="none" strokeWidth="1" fill="none"
                                        fillRule="evenodd">
                                        <g id="container" transform="translate(2.000000, 2.000000)" fillRule="nonzero">
                                            <rect id="mask" stroke="#000000" strokeWidth="2" fill="#000000" x="-1"
                                                y="-1" width="71" height="71" rx="14">

                                            </rect>
                                            <path
                                                d="M58.3067362,21.4281798 C55.895743,17.2972267 52.6253846,14.0267453 48.4948004,11.615998 C44.3636013,9.20512774 39.8535636,8 34.9614901,8 C30.0700314,8 25.5585181,9.20549662 21.4281798,11.615998 C17.2972267,14.0266224 14.0269912,17.2972267 11.615998,21.4281798 C9.20537366,25.5590099 8,30.0699084 8,34.9607523 C8,40.8357654 9.71405782,46.1187277 13.1430342,50.8109917 C16.5716416,55.5036246 21.0008949,58.7507436 26.4304251,60.5527176 C27.0624378,60.6700211 27.5302994,60.5875152 27.8345016,60.3072901 C28.1388268,60.0266961 28.290805,59.6752774 28.290805,59.2545094 C28.290805,59.1842994 28.2847799,58.5526556 28.2730988,57.3588401 C28.2610487,56.1650247 28.2553926,55.1235563 28.2553926,54.2349267 L27.4479164,54.3746089 C26.9330843,54.468919 26.2836113,54.5088809 25.4994975,54.4975686 C24.7157525,54.4866252 23.9021284,54.4044881 23.0597317,54.2517722 C22.2169661,54.1004088 21.4330982,53.749359 20.7075131,53.1993604 C19.982297,52.6493618 19.4674649,51.9294329 19.1631397,51.0406804 L18.8120898,50.2328353 C18.5780976,49.6950097 18.2097104,49.0975487 17.7064365,48.4426655 C17.2031625,47.7871675 16.6942324,47.3427912 16.1794003,47.108799 L15.9336039,46.9328437 C15.7698216,46.815909 15.6178435,46.6748743 15.4773006,46.511215 C15.3368806,46.3475556 15.2317501,46.1837734 15.1615401,46.0197452 C15.0912072,45.855594 15.1494901,45.7209532 15.3370036,45.6153308 C15.5245171,45.5097084 15.8633939,45.4584343 16.3551097,45.4584343 L17.0569635,45.5633189 C17.5250709,45.6571371 18.104088,45.9373622 18.7947525,46.4057156 C19.4850481,46.8737001 20.052507,47.4821045 20.4972521,48.230683 C21.0358155,49.1905062 21.6846737,49.9218703 22.4456711,50.4251443 C23.2060537,50.9284182 23.9727072,51.1796248 24.744894,51.1796248 C25.5170807,51.1796248 26.1840139,51.121096 26.7459396,51.0046532 C27.3072505,50.8875956 27.8338868,50.7116403 28.3256025,50.477771 C28.5362325,48.9090515 29.1097164,47.7039238 30.0455624,46.8615271 C28.7116959,46.721353 27.5124702,46.5102313 26.4472706,46.2295144 C25.3826858,45.9484285 24.2825656,45.4922482 23.1476478,44.8597436 C22.0121153,44.2280998 21.0701212,43.44374 20.3214198,42.5080169 C19.5725954,41.571802 18.9580429,40.3426971 18.4786232,38.821809 C17.9989575,37.300306 17.7590632,35.5451796 17.7590632,33.5559381 C17.7590632,30.7235621 18.6837199,28.3133066 20.5326645,26.3238191 C19.6665366,24.1944035 19.7483048,21.8072644 20.778215,19.1626478 C21.4569523,18.951772 22.4635002,19.1100211 23.7973667,19.6364115 C25.1314792,20.1630477 26.1082708,20.6141868 26.7287253,20.9882301 C27.3491798,21.3621504 27.8463057,21.6790175 28.2208409,21.9360032 C30.3978419,21.3277217 32.644438,21.0235195 34.9612442,21.0235195 C37.2780503,21.0235195 39.5251383,21.3277217 41.7022622,21.9360032 L43.0362517,21.0938524 C43.9484895,20.5319267 45.0257392,20.0169716 46.2654186,19.5488642 C47.5058357,19.0810026 48.4543466,18.9521409 49.1099676,19.1630167 C50.1627483,21.8077563 50.2565666,24.1947724 49.3901927,26.324188 C51.2390143,28.3136755 52.1640399,30.7245457 52.1640399,33.556307 C52.1640399,35.5455485 51.9232849,37.3062081 51.444357,38.8393922 C50.9648143,40.3728223 50.3449746,41.6006975 49.5845919,42.5256002 C48.8233486,43.4503799 47.8753296,44.2285916 46.7404118,44.8601125 C45.6052481,45.4921252 44.504759,45.9483056 43.4401742,46.2293914 C42.3750975,46.5104772 41.1758719,46.7217219 39.8420054,46.8621419 C41.0585683,47.9149226 41.6669728,49.5767225 41.6669728,51.846804 L41.6669728,59.2535257 C41.6669728,59.6742937 41.8132948,60.0255895 42.1061847,60.3063064 C42.3987058,60.5865315 42.8606653,60.6690374 43.492678,60.5516109 C48.922946,58.7498829 53.3521992,55.5026409 56.7806837,50.810008 C60.2087994,46.117744 61.923472,40.8347817 61.923472,34.9597686 C61.9222424,30.0695396 60.7162539,25.5590099 58.3067362,21.4281798 Z"
                                                id="Shape" fill="#FFFFFF">

                                            </path>
                                        </g>
                                    </g>
                                </svg>

                                <span>Log in with Github</span>
                            </button>
                            <div className='flex items-center gap-2'>
                                <div className='border-[1px] w-[106px] h-[0.1vh] items-center'></div>
                                <div>or</div>
                                <div className='border-[1px] w-[106px] h-[0.1vh] items-center'></div>
                            </div>
                            <button
                                onClick={() => setmode("EMAIL")}
                                className=" flex w-[245px] justify-center items-center shadow-md max-w-xs text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">

                                <span>Log in with Email</span>
                            </button>


                        </div>}
                    {mode === MODE.EMAIL &&
                        <div className="flex flex-col gap-4 min-h-[70.3vh] items-center mt-[5vh] pb-[20vh] md:pb-10 ">

                            <div className='flex flex-col gap-1'>
                                <label htmlFor="email" className='text-sm'>E-mail</label>
                                <input className='outline-none border-2 rounded-lg p-[1vw] w-60' name='email' value={form.email ? form.email : ""} onChange={handleChange} type="text" placeholder='john@gmail.com' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="password" className='text-sm'>Password</label>
                                <input className='outline-none border-2 rounded-lg p-[1vw] w-60' name='password' value={form.password ? form.password : ""} onChange={handleChange} type="text" placeholder='Enter your password' />
                            </div>
                            <div className='flex gap-3 flex-col'>
                                <div className='text-red-600'>{message}</div>
                                <div className='text-sm underline cursor-pointer' onClick={() => setmode("RESET_PASSWORD")} >Forgot Password?</div>
                                <button onClick={() => getdatalogin()} className='text-white text-base rounded-lg w-60 py-[1vh] bg-red-400'>Login</button>
                                <div onClick={() => setmode("REGISTER")} className='text-sm underline cursor-pointer'>{"Don't have an account?"}</div>
                            </div>
                        </div>
                    }
                    {mode === MODE.REGISTER &&
                        (mode2 !== "confirm" ?
                            <div className="flex flex-col gap-4 min-h-[70.3vh] items-center mt-[5vh] pb-[20vh] md:pb-10 ">
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="username" className='text-sm'>Username</label>
                                    <input className='outline-none border-2 rounded-lg p-[1vw] w-60' name='username' value={form.username ? form.username : ""} onChange={handleChange} type="text" placeholder='john' />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="email" className='text-sm'>E-mail</label>
                                    <input className='outline-none border-2 rounded-lg p-[1vw] w-60' name='email' value={form.email ? form.email : ""} onChange={handleChange} type="text" placeholder='john@gmail.com' />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="password" className='text-sm'>Password</label>
                                    <input className='outline-none border-2 rounded-lg p-[1vw] w-60' name='password' value={form.password ? form.password : ""} onChange={handleChange} type="text" placeholder='Enter your password' />
                                </div>
                                <div className=' flex gap-3 flex-col'>
                                    {/* <div className='text-sm underline cursor-pointer'>Forgot Password?</div> */}
                                    <div className='text-red-600'>{message}</div>
                                    <button onClick={async () => {
                                        let a = await registeruser()
                                        if (a) {
                                            toast.dismiss();
                                            setmode2("confirm")
                                            setIsLoading(false)
                                            toast.success(`Verification Code sent to ${form.email}!`, {
                                                    position: "bottom-right",
                                                    autoClose: 3000,
                                                    hideProgressBar: true,
                                                    stacked: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: "colored",
                                                });
                                        }
                                        setIsLoading(false)
                                    }} className='text-white text-base rounded-lg w-60 py-[1vh] bg-red-400'>Register</button>
                                    <div onClick={() => setmode("EMAIL")} className='text-sm underline cursor-pointer'>Have an account?Login</div>
                                </div>
                            </div>

                            :

                            <div className="flex flex-col gap-4 min-h-[70.3vh] items-center mt-[14vh] pb-[20vh] md:pb-10 ">
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="verification" className='text-sm'>Email verification Code</label>
                                    <input className='outline-none border-2 rounded-lg p-[1vw] w-60' name='verification' value={form.verification ? form.verification : ""} onChange={handleChange} type="text" placeholder='otp' />
                                </div>

                                <div className=' flex gap-3 flex-col'>
                                    {/* <div className='text-sm underline cursor-pointer'>Forgot Password?</div> */}
                                    <button onClick={() => confirm()} className='text-white text-base rounded-lg w-60 py-[1vh] bg-red-400'>confirm</button>
                                    {/* <div onClick={() => setmode("EMAIL")} className='text-sm underline cursor-pointer'>Have an account?Login</div> */}
                                </div>
                            </div>
                        )
                    }

                    {mode === MODE.RESET_PASSWORD &&

                        (mode2 !== "confirm" ? <div className="flex flex-col gap-4 min-h-[70.3vh] items-center mt-[5vh] pb-[20vh] md:pb-10 ">

                            <div className='flex flex-col gap-1'>
                                <label htmlFor="email" className='text-sm '>E-mail</label>
                                <input className='outline-none border-2 rounded-lg p-[1vw] w-60' type="text" name='email' value={form.email ? form.email : ""} onChange={handleChange} placeholder='john@gmail.com' />
                            </div>

                            <div className=' flex gap-3 flex-col'>
                                {/* <div className='text-sm underline cursor-pointer'>Forgot Password?</div> */}
                                <div className='text-red-600'>{message}</div>
                                <button onClick={async () => {
                                    let b = await resetpassword()
                                    if (b) {
                                        toast.dismiss();
                                        setmode2("confirm")
                                        setIsLoading(false)
                                        toast.success(`Code sent to ${form.email}!`, {
                                            position: "bottom-right",
                                            autoClose: 3000,
                                            hideProgressBar: true,
                                            stacked: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "colored",
                                        });

                                    }
                                    setIsLoading(false)
                                }} className='text-white text-base rounded-lg w-60 py-[1vh] bg-red-400'>Reset</button>
                                <div onClick={() => setmode("LOGIN")} className='text-sm underline cursor-pointer'>Go back to login</div>
                            </div>
                        </div>
                            :

                            <div className="flex flex-col gap-4 min-h-[70.3vh] items-center mt-[5vh] pb-[20vh] md:pb-10 ">

                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="newpassword" className='text-sm'>New Password</label>
                                    <input className='outline-none border-2 rounded-lg p-[1vw] w-60' type="text" name='newpassword' value={form.newpassword ? form.newpassword : ""} onChange={handleChange} placeholder='Enter new password' />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="verification" className='text-sm'>Confirmation Code</label>
                                    <input className='outline-none border-2 rounded-lg p-[1vw] w-60' name='verification' value={form.verification ? form.verification : ""} onChange={handleChange} type="text" placeholder='code' />
                                </div>
                                <div className=' flex gap-3 flex-col'>
                                    {/* <div className='text-sm underline cursor-pointer'>Forgot Password?</div> */}
                                    <button onClick={() => confirm()} className='text-white text-base rounded-lg w-60 py-[1vh] bg-red-400'>confirm</button>
                                    {/* <div onClick={() => setmode("REGISTER")} className='text-sm underline cursor-pointer'>Go back to login</div> */}
                                </div>
                            </div>
                        )
                    }
                </div>}
        </div>
    )
}

export default Page
