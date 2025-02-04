import React from 'react'

const Footer = () => {
  return (
    <div className='relative z-30 bottom-0  '>
      <div className=" flex  w-[100vw] h-[50vh]    items-center justify-around  bg-slate-300 text-black sm:text-xs text-[8px]">
        <div className="w-[10vw] sm:w-[15vw] flex flex-col gap-[1vw]">
          <div className="font-bold h-8 sm:h-14">LAMA</div>
          <div>3252 Winding way,Central plaza,Willowbrook, CA 90210, United States</div>
          <div className="font-semibold">hello@lama.dev</div>
          <div className="font-semibold">+1 234 567 890</div>
          <div>home</div>
        </div>

        <div className="text-black gap-x-[0.3vw] grid grid-cols-3 justify-center items-center">

          <div className=" flex flex-col gap-[1.1vw]">
            <div className="font-semibold h-14">COMPANY</div>
            <div>About us</div>
            <div>Careers</div>
            <div>Affiliates</div>
            <div>Blog</div>
            <div>Contact us</div>
          </div>
          <div className=" flex flex-col gap-[1.1vw]">
            <div className="font-semibold h-14">SHOP</div>
            <div>New Arrivals</div>
            <div>Accessories</div>
            <div>Men</div>
            <div>Women</div>
            <div>All Products</div>
          </div>
          <div className=" flex flex-col gap-[1.1vw]">
            <div className="font-semibold h-14">HELP</div>
            <div>Customer Services</div>
            <div>My Account</div>
            <div>Find a Store</div>
            <div>Legal & Privacy</div>
            <div>Gift Card</div>
          </div>
        </div>
        <div className="w-[20vw] lg:w-[25vw] flex flex-col gap-[1.1vw]">
          <div className="font-semibold h-14">SUBSCRIBE</div>

          <div>Be the first to get the latest news about trends,promotions, and much more!</div>
          <div className="flex">
            <input type="text" className="w-full outline-none h-5 sm:h-7 lg:h-10  pl-1 sm:pl-3 relative inline-flex items-center justify-center p-0.5 overflow-hidden " placeholder="Email Address" />
            <div className="bg-pink-300 h-5 sm:h-7 lg:h-10 w-14 text-center py-[1vw]">JOIN</div>
          </div>
          <div className="font-semibold">Secure Payments</div>
          <div>home</div>
        </div>
      </div>
    </div>
  )
}

export default Footer
