'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchCart, fetchUser } from '@/actions/useraction'

const Navbar = () => {
  const [search, setsearch] = useState()
  const { data: session, status } = useSession()
  const [log, setlog] = useState(false)
  const router = useRouter()
  const [item, setitem] = useState(0)
  const [form, setform] = useState([])
  const [name, setname] = useState("")
  const [showdropdown, setshowdropdown] = useState(false)
  
  useEffect(() => {
    if (status === "loading") {
      
      return;
    } else {

      if (session) {
        setlog(false)
        getitem()
      }
      else {
        setlog(true)
        setTimeout(() => { setlog(false) }, 10000)
      }
    }

  }, [status, session])

  const getitem = async () => {
    let c = await fetchUser(session.user.email)
    setform(c)
    let z = c.username.split(" ")[0]
    setname(z)
    let a = await fetchCart(session.user.email)
    let b = JSON.parse(a);

    setitem(b.length)
  }

  const handleChange = (e) => {
    setsearch(e.target.value)
  }
  const handleKeyDown = (event) => {
    // event.preventDefault();
    if (event.key === 'Enter') {
      router.push(`/${search}`)
    }
   
  }

  const reloadPage = (url) => {
    window.location.href = url;
  };

  return (
    <div className='sticky top-0 z-10  bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' >

      <div className="navbar flex border-1 sticky z-10 top-0 text-black items-center justify-around sm:justify-center h-[8vh] lg:h-[10vh]">
        <div className="flex gap-7 pr-[10vw] pl-[5vw] sm:pl-[0vw] text-center">
          {/* <Link href={'/'}><div className="sm:text-lg text-base font-semibold">LAMA</div></Link> */}
          <Link href={'/'}><div className="md:px-4 py-1 px-3 text-lg md:text-2xl font-extrabold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">LAMA</div></Link>
          {/* <div className="flex gap-[1.5vw]">
            <Link href={'/'}><div>Home</div></Link>
            <Link href={"/shopify"}><div>Shop</div></Link>
            <Link href={'/deals'}><div>Deals</div></Link>
            <Link href={"/about"}><div>About</div></Link>
            // <Link href={'/contact'}><div>Contact</div></Link>
             <div onClick={() => signOut()}>signout</div> 
          </div> */}
        </div>
        {/* <div className="flex  items-center "> */}
          <div className='relative sm:block hidden'>
            <input  value={search} onChange={handleChange} onKeyDown={handleKeyDown} className=" shadow-sm shadow-slate-400 bg-slate-200 outline-none h-8 sm:h-10 w-[40vw]  pl-[3.3vw]  relative inline-flex items-center justify-center pr-[1vw] p-0.5 my-2 md:my-1 me-2 overflow-hidden text-sm rounded-xl" type="text" placeholder="Search for Products, Brands and More" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="search-icon absolute w-4 top-[35%] left-[1vw]"><path fill="gray" d="M11.435 10.063h-.723l-.256-.247a5.92 5.92 0 0 0 1.437-3.87 5.946 5.946 0 1 0-5.947 5.947 5.92 5.92 0 0 0 3.87-1.437l.247.256v.723L14.637 16 16 14.637l-4.565-4.574Zm-5.489 0A4.111 4.111 0 0 1 1.83 5.946 4.111 4.111 0 0 1 5.946 1.83a4.111 4.111 0 0 1 4.117 4.116 4.111 4.111 0 0 1-4.117 4.117Z"></path></svg>
          </div>
          <button onClick={() => { session ? setshowdropdown(!showdropdown) : router.push("/login") }} onBlur={() => { setTimeout(() => { setshowdropdown(false) }, 5000); }} id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" className="flex gap-2 hover:bg-blue-500 cursor-pointer font-medium rounded-lg text-sm ml-[7vw] sm:mx-[1.7vw] mx-[0.2vw] px-[0.8vw]  py-2 my-1 outline-none items-center  " type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
              <path d="M12 2C17.5237 2 22 6.47778 22 12C22 17.5222 17.5237 22 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21.5C7.81163 21.0953 6.69532 20.5107 5.72302 19.7462M5.72302 4.25385C6.69532 3.50059 7.81163 2.90473 9 2.5M2 10.2461C2.21607 9.08813 2.66019 7.96386 3.29638 6.94078M2 13.7539C2.21607 14.9119 2.66019 16.0361 3.29638 17.0592" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 16.5C10.0726 14.302 13.9051 14.1986 16 16.5M14.2179 9.75C14.2179 10.9926 13.2215 12 11.9925 12C10.7634 12 9.76708 10.9926 9.76708 9.75C9.76708 8.50736 10.7634 7.5 11.9925 7.5C13.2215 7.5 14.2179 8.50736 14.2179 9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className=' max-w-16 sm:text-base text-sm overflow-hidden text-ellipsis'>{session ? name : "Login"}</div>
            {/* <div className='w-[6vw]'>sign</div> */}
            {session &&
              <svg className="w-2.5 h-2.5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>}
            {log && !session &&
              <div className='absolute z-10 sm:top-[8vh] top-[6vh] text-white sm:right-[21vw] flex flex-col items-center'>
                <div className='border-x-8 border-b-8 border-x-transparent border-t-transparent border-b-blue-500 w-0 h-0'></div>
                <div className=' bg-blue-500 rounded-sm text-lg px-5 py-2 '>Login</div>
              </div>}
          </button>



          {/* <!-- Dropdown menu --> */}
          {session &&
            <div id="dropdownAvatarName" className={`z-10 ${showdropdown ? "" : "hidden"} absolute top-16 right-[17vw] shadow-slate-300 bg-slate-50 divide-y divide-slate-300 rounded-sm shadow w-44  dark:divide-slate-300`}>
              {/* <div className="px-4 py-3 text-sm text-gray-900 font-medium ">
              Pro User
            </div> */}
              <Link href={"/profile/Profile_Information"}><div className='flex items-center hover:bg-slate-200 pl-[1vw] py-[0.5vh]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 14"><path fill="#2874F1" fillRule="nonzero" d="M7 .333A6.67 6.67 0 0 0 .333 7 6.67 6.67 0 0 0 7 13.667 6.67 6.67 0 0 0 13.667 7 6.67 6.67 0 0 0 7 .333zm0 2c1.107 0 2 .894 2 2 0 1.107-.893 2-2 2s-2-.893-2-2c0-1.106.893-2 2-2zM7 11.8a4.8 4.8 0 0 1-4-2.147C3.02 8.327 5.667 7.6 7 7.6c1.327 0 3.98.727 4 2.053A4.8 4.8 0 0 1 7 11.8z"></path></svg>
                <div className="block px-4 py-2 text-sm text-gray-700 ">My Profile</div>
              </div></Link>
              <Link href={"/profile/My_Orders"}><div className='flex items-center hover:bg-slate-200 pl-[1vw] py-[0.5vh]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" className="" viewBox="0 0 16 12"><g fill="none" fillRule="evenodd"><path fill="#2874F1" d="M6.038 11.682h8.407c.565 0 1.018-.38 1.13-.855V.847H.426v9.98c0 .475.452.855 1.017.855h2.232v-2.98H1.94L4.776 6l2.996 2.703H6.038v2.98z"></path></g></svg>
                <div className="block px-4 py-2 text-sm text-gray-700 ">Orders</div>
              </div></Link>
              <Link href={"/profile/My_Wishlist"}><div className='flex items-center hover:bg-slate-200 pl-[1vw] py-[0.5vh]'>
                <svg xmlns="http://www.w3.org/2000/svg" className="" width="16" height="14" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill="#2874F0" className="" stroke="#FFF" fillRule="evenodd" opacity=".9"></path></svg>
                <div className="block px-4 py-2 text-sm text-gray-700 ">Wishlist</div>
              </div></Link>
              <Link href={"/profile/Notification"}><div className='flex items-center hover:bg-slate-200 pl-[1vw] py-[0.5vh]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="" viewBox="0 0 12 14"><g fill="none" fillRule="evenodd"><path d="M-4-3h20v20H-4z"></path><path fill="#2874F1" d="M6.17 13.61c-1.183 0-1.922-.723-1.922-1.88H8.09c0 1.157-.74 1.88-1.92 1.88zm4.222-5.028l1.465 1.104v1.07H0v-1.07l1.464-1.104v-2.31h.004c.035-2.54 1.33-4.248 3.447-4.652V.992C4.915.446 5.37 0 5.928 0c.558 0 1.014.446 1.014.992v.628c2.118.404 3.412 2.112 3.446 4.65h.004v2.312z"></path></g></svg>
                <div className="block px-4 py-2 text-sm text-gray-700 ">Notifications</div>
              </div></Link>
              <div onClick={() => signOut()} className='cursor-pointer flex items-center hover:bg-slate-200 pl-[1vw] py-[0.5vh]'>
                <svg width="16" height="16" className="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#2874F0" strokeWidth="0.3" stroke="#2874F0" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>
                <div className="block px-4 py-2 text-sm text-gray-700 ">Logout</div>
              </div>
              {/* <div onClick={() => signOut()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200">Sign out</div>
            <div onClick={() => signOut()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200">Sign out</div>
            <div onClick={() => signOut()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200">Sign out</div> */}
            </div>}


          {/* <Link href={"/login"}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
            <path d="M12 2C17.5237 2 22 6.47778 22 12C22 17.5222 17.5237 22 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21.5C7.81163 21.0953 6.69532 20.5107 5.72302 19.7462M5.72302 4.25385C6.69532 3.50059 7.81163 2.90473 9 2.5M2 10.2461C2.21607 9.08813 2.66019 7.96386 3.29638 6.94078M2 13.7539C2.21607 14.9119 2.66019 16.0361 3.29638 17.0592" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 16.5C10.0726 14.302 13.9051 14.1986 16 16.5M14.2179 9.75C14.2179 10.9926 13.2215 12 11.9925 12C10.7634 12 9.76708 10.9926 9.76708 9.75C9.76708 8.50736 10.7634 7.5 11.9925 7.5C13.2215 7.5 14.2179 8.50736 14.2179 9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg></Link> */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
            <path d="M13.5 5.29686C12.8666 5.10373 12.1949 5 11.5 5C7.85617 5 4.84988 7.85222 4.65837 11.491C4.58489 12.887 4.66936 14.373 3.42213 15.3084C2.84164 15.7438 2.5 16.427 2.5 17.1527C2.5 18.1508 3.2818 19 4.3 19H18.7C19.7182 19 20.5 18.1508 20.5 17.1527C20.5 16.427 20.1584 15.7438 19.5779 15.3084C19.5513 15.2885 19.5254 15.2683 19.5 15.2479" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 3.125C10 3.95343 10.6716 5 11.5 5C12.3284 5 13 3.95343 13 3.125C13 2.29657 12.3284 2 11.5 2C10.6716 2 10 2.29657 10 3.125Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14.5 19C14.5 20.6569 13.1569 22 11.5 22C9.84315 22 8.5 20.6569 8.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.55 7.05L20.45 11.95M21.5 9.5C21.5 7.567 19.933 6 18 6C16.067 6 14.5 7.567 14.5 9.5C14.5 11.433 16.067 13 18 13C19.933 13 21.5 11.433 21.5 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg> */}
          {/* <Link href={"/cart"}> */}
          <div
            onClick={() => reloadPage('/cart')}
            className='relative cursor-pointer ml-[0.9vw] flex gap-[0.7vw]'>
            <Image src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header_cart-eed150.svg" alt="Cart" className="_1XmrCc" width="24" height="24" />
            <div className='absolute flex items-center  justify-center text-xs bottom-[2vh] left-[0.7vw] bg-red-500 text-white  rounded-full w-5 h-5'>{item}</div>
            <div className='sm:block hidden'>Cart</div>
          </div>
          {/* </Link> */}
        {/* </div> */}
      </div >
      <div className='relative text-center sm:hidden z-0 '>
            <input  value={search} onChange={handleChange} enterKeyHint="search" onKeyDown={(e)=>{ e.preventDefault();
              handleKeyDown(e)}} className="z-10 shadow-sm shadow-slate-400 bg-slate-200 outline-none h-11 sm:h-10 w-[70vw]  pl-7  relative inline-flex items-center justify-center pr-[1vw] p-0.5 my-2 md:my-1 me-2 overflow-hidden text-sm rounded-xl" type="text" placeholder="Search for Products" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="search-icon z-10 absolute w-4 top-[35%] left-[16vw]"><path fill="gray" d="M11.435 10.063h-.723l-.256-.247a5.92 5.92 0 0 0 1.437-3.87 5.946 5.946 0 1 0-5.947 5.947 5.92 5.92 0 0 0 3.87-1.437l.247.256v.723L14.637 16 16 14.637l-4.565-4.574Zm-5.489 0A4.111 4.111 0 0 1 1.83 5.946 4.111 4.111 0 0 1 5.946 1.83a4.111 4.111 0 0 1 4.117 4.116 4.111 4.111 0 0 1-4.117 4.117Z"></path></svg>
          </div>
    </div>
  )
}

export default Navbar
