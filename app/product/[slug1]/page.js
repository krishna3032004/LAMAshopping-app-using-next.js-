"use client"
import { fetchProduct, fetchUser, updatewishlist, putcheckout } from '@/actions/useraction'
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { updateCart } from '@/actions/useraction'
import { checkcart } from '@/actions/useraction'
// import Router from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Page = ({ params }) => {
  // const {data: session,status}= useSession()
  const [reviews, setreviews] = useState([])
  const [count, setcount] = useState(1)
  const [product, setproduct] = useState({})
  const { data: session, status } = useSession()
  const [cart, setcart] = useState(false)
  const [color, setColor] = useState("gray");
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (status === "loading") {
      // Wait until session is loaded

      return;
    } else {

      let a = params.slug1

      getdata(a)
    }
  }, [status])

  const photos = [
    {
      id: 1,
      title: "abs",
      img: "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/x/b/-original-imahf3bfjrttzuyt.jpeg?q=70",
    },
    {
      id: 2,
      title: "aig",
      img: "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/x/b/-original-imahf3bfjrttzuyt.jpeg?q=70",
    },
    {
      id: 3,
      title: "sihdk",
      img: "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/x/b/-original-imahf3bfjrttzuyt.jpeg?q=70",
    },
    {
      id: 4,
      title: "sihdk",
      img: "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/x/b/-original-imahf3bfjrttzuyt.jpeg?q=70",
    }
  ]

  const handleClick = async () => {
    toast.dismiss();
    if (session) {
      setColor(color === "gray" ? "#ff4343" : "gray"); // Toggle color
      await updatewishlist(session.user.email, product._id, color)
      if (color === "gray") {
        toast.dismiss();
        toast.success('Added to your Wishlist!', {
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

      } else {
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
          transition: Bounce,
        });

      }
    }
    else {
      toast.warning('First do Login!', {
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
    }
  };

  const updatecart = async () => {
    toast.dismiss();
    if (session) {
      await updateCart(session.user.email, product._id, count)
      setcart(true)
      toast.success('Added to your Cart!', {
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
    else {
      toast.warning('First do Login!', {
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
    }
  }
  const getdata = async (id) => {
    let a = await fetchProduct(id)
    if (session) {
      let b = await checkcart(session.user.email, a._id)
      let c = await fetchUser(session.user.email)

      for (let value of c.wishlist) {
        if (value.toString() === id) {
          setColor("#ff4343")
        }

      }
      setcart(b)
    }
    setproduct(a)
    if (a.quantity === 0) {
      setcount(0)
    }
    // let n =JSON.parse(a.review);
    a.review.reverse()
    setreviews(a.review)
    setIsLoading(false)
  }
  const buyit = async () => {
    toast.dismiss();
    setIsLoading(true)
    if (session) {
      let a = await putcheckout(session.user.email, params.slug1, count)

      if (a) {
        
        router.push(`${params.slug1}/checkout`)
      }
    } else {
      toast.warning('First do Login!', {
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
    }
  }
  const reloadPage = (url) => {
    window.location.href = url;
  };
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
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

      {isLoading ? <div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay="autoplay" muted loop="loop" type="video/mp4"></video></div>
        :
        <div className='sm:flex-row flex-col flex gap-10 justify-center my-5'>
          <div className='mx-6  flex flex-col gap-8'>
            <div className=' overflow-hidden flex justify-center'>
              {/* <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/x/b/-original-imahf3bfjrttzuyt.jpeg?q=70" alt="" /> */}
              <img src={product.image} alt="" />
            </div>
            <div className='sm:w-[7vh] md:w-[8vh] md:h-[8vh] w-[6vh] h-[6vh] sm:h-[7vh] absolute left-[79vw] sm:left-[38vw] md:left-[36vw] lg:left-[34vw] bg-slate-50 flex justify-center items-center shadow-sm shadow-slate-400 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' onClick={handleClick} width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill={color} stroke="#FFF" fillRule="evenodd" opacity=".9"></path></svg>
            </div>
            {/* <div className='flex gap-6 mx-2'>
              {photos.map((photo) => (
                <div key={photo.id}>
                  <img src={photo.img} alt="" />
                </div>
              ))}
            </div> */}
          </div>
          <div className='sm:w-[54vw] mx-5'>
            <div className='font-semibold text-xl sm:text-2xl'>{product.name}</div>
            <div className='my-7 text-gray-400 text-sm'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis fuga necessitatibus veniam ex atque eaque mollitia dolorum sequi adipisci nam? Hic pariatur debitis et quia, quas perferendis, velit quibusdam quisquam sapiente quis eligendi tenetur molestias alias sed sint iure architecto ab, saepe perspiciatis veritatis non? Quasi, molestias quisquam. Amet, ut?</div>
            <div className='border-[0.1px] w-full border-gray-100'></div>
            <div className='flex gap-4 my-5 items-center'>
              <div className='font-semibold text-lg text-gray-400 decoration-2 line-through'>₹{product.old_amount}</div>
              <div className='font-semibold text-xl text-black'>₹{product.amount}</div>
            </div>
            <div className='border-[0.1px] w-full border-gray-100'></div>
            <div className='my-3 mt-6 font-semibold text-sm'>Choose a Color</div>
            <div className='flex gap-2'>
              <div className='rounded-full w-8 h-8 border-[1px] bg-white'></div>
              <div className='rounded-full w-8 h-8  bg-orange-400'></div>
              <div className='rounded-full w-8 h-8  bg-emerald-400'></div>
            </div>
            <div className='my-3 mt-6 font-semibold text-sm'>Choose a Size</div>
            <div className='flex gap-3'>
              <div className='border-[1.5px] inline-block px-4 py-1 font-semibold text-sm rounded-md border-red-300 text-red-300'>Small</div>
              <div className='border-[1.5px] inline-block px-4 py-1 font-semibold text-sm rounded-md border-red-300 text-red-300'>Medium</div>
              <div className='border-[1.5px] inline-block px-4 py-1 font-semibold text-sm rounded-md border-red-300 text-red-300'>Large</div>
            </div>
            <div className='my-3 mt-6 font-semibold'>Choose a Quantity</div>
            <div className='flex lg:flex-row flex-col my-4 mb-10 lg:justify-between lg:items-center lg:text-center'>
              <div className='flex  items-center'>
                <div onClick={() => { count > 1 ? setcount(count - 1) : "" }} className={`${count === 1 ? "text-gray-300" : "text-black"} bg-gray-200 cursor-pointer px-5 text-lg rounded-l-full py-2`}>-</div>
                <div className='bg-gray-200 px-2 text-lg  py-2'>{count}</div>
                <div onClick={() => { count !== product.quantity ? setcount(count + 1) : "" }} className={`${count === product.quantity ? "text-gray-300" : "text-black"} bg-gray-200 cursor-pointer px-5  text-lg rounded-r-full py-2`}>+</div>
                {product.quantity >= 1 &&
                  <div className='text-sm'>
                    <div className='flex gap-1'>
                      <div>Only</div>
                      <div className='text-orange-400'>{product.quantity} items</div>
                      <div>left!</div>
                    </div>
                    <div>{"Don't miss it"}</div>
                  </div>}
                {product.quantity === 0 &&
                  <div className='text-sm text-red-500'>This product is currently Out of Stock</div>
                }
              </div>
              {product.quantity >= 1 &&
              <div className='lg:mt-0 mt-6'>
                <div className=' gap-2 sm:flex hidden'>

                  <div onClick={() => buyit()} className='rounded-full cursor-pointer border-[1.5px] text-sm border-red-300 bg-red-500 text-white px-6 py-3'>Buy Now</div>
                  {!cart && <div onClick={() => { updatecart() }} className='cursor-pointer rounded-full border-[1.5px] text-sm border-red-300 text-red-300 px-6 py-3'>Add To Cart</div>}
                  {cart && <div onClick={() => reloadPage('/cart')} className='cursor-pointer rounded-full border-[1.5px] text-sm bg-orange-700 border-red-300 text-white px-6 py-3'>Go To Cart</div>}
                  {/* {cart ? <div onClick={() => { updatecart() }} className='cursor-pointer rounded-full border-[1.5px] text-sm border-red-300 text-red-300 px-6 py-3'>Go To Cart</div>
                  :
                  <Link href={"/cart"}><div className='cursor-pointer rounded-full border-[1.5px] text-sm border-red-300 text-red-300 px-6 py-3'>Add To Cart</div></Link>} */}
                </div>
                <div className='flex left-0  text-center sm:hidden fixed bottom-0 w-full bg-white'>

                  <div onClick={() => buyit()} className='cursor-pointer border-[1.5px] w-1/2 text-sm border-red-300 bg-red-500 text-white px-6 py-4'>Buy Now</div>
                  {!cart && <div onClick={() => { updatecart() }} className='cursor-pointer w-1/2 border-l-0   border-[1.5px] text-sm border-red-300 text-red-300 px-6 py-4'>Add To Cart</div>}
                  {cart && <div onClick={() => reloadPage('/cart')} className='cursor-pointer w-1/2 rounded-full border-l-0  border-[1.5px] text-sm bg-orange-700 border-red-300 text-white px-6 py-3'>Go To Cart</div>}
                  {/* {cart ? <div onClick={() => { updatecart() }} className='cursor-pointer rounded-full border-[1.5px] text-sm border-red-300 text-red-300 px-6 py-3'>Go To Cart</div>
                  :
                  <Link href={"/cart"}><div className='cursor-pointer rounded-full border-[1.5px] text-sm border-red-300 text-red-300 px-6 py-3'>Add To Cart</div></Link>} */}
                </div>
                </div>
                }
              {/* {product.quantity===0 && 
            <div>
              <div className='rounded-full border-[1.5px] text-sm border-red-300 bg-red-500 text-white px-6 py-3'>Out Of Stock</div>
            </div>
            } */}
            </div>
            <div className='border-[0.1px] w-full border-gray-100'></div>
            <div className='flex flex-col my-7 gap-3'>
              <div className='text-sm font-semibold'>PRODUCT INFO</div>
              <div className='text-xs'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus odio atque alias officiis. Cupiditate soluta ipsum labore corporis repudiandae exercitationem odit veniam explicabo. Sunt iste perspiciatis tenetur ex explicabo ipsam quisquam, provident quasi voluptatum commodi voluptatem praesentium dolore nobis consequuntur.</div>
            </div>
            <div className='flex flex-col my-7 gap-3'>
              <div className='text-sm font-semibold'>RETURN & REFUND POLICY</div>
              <div className='text-xs'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus odio atque alias officiis. Cupiditate soluta ipsum labore corporis repudiandae exercitationem odit veniam explicabo. Sunt iste perspiciatis tenetur ex explicabo ipsam quisquam, provident quasi voluptatum commodi voluptatem praesentium dolore nobis consequuntur.</div>
            </div>
            <div className='flex flex-col my-7 gap-3'>
              <div className='text-sm font-semibold'>SHIPPING INFO</div>
              <div className='text-xs'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus odio atque alias officiis. Cupiditate soluta ipsum labore corporis repudiandae exercitationem odit veniam explicabo. Sunt iste perspiciatis tenetur ex explicabo ipsam quisquam, provident quasi voluptatum commodi voluptatem praesentium dolore nobis consequuntur.</div>
            </div>
            <div className='border-[0.1px] w-full border-gray-100'></div>
            <div className='mb-[5vh]'>
              <div className='my-7 text-xl font-semibold'>User Reviews</div>
              {reviews[0] ?
                <div>
                  {reviews.map((revie,index) => (

                    <div key={index} className='flex flex-col gap-3 text-xs pb-[2vh] mt-[2vh] border-b-[0.2vh] '>
                      <div className='flex gap-3 items-center'>
                        <div className='rounded-full bg-gray-100 flex justify-center items-center text-red-300 px-[1.8vh] sm:px-[2vh] py-[1.2vh]'>{revie.name.charAt(0)}</div>
                        <div className='font-semibold'>{revie.name}</div>
                      </div>
                      <div className='flex gap-3 items-center'>
                        <div className='bg-green-600 flex gap-1  sm:w-[3vw] py-1 px-2 text-white font-semibold rounded-lg'>{revie.star}
                          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMiI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTYuNSA5LjQzOWwtMy42NzQgMi4yMy45NC00LjI2LTMuMjEtMi44ODMgNC4yNTQtLjQwNEw2LjUuMTEybDEuNjkgNC4wMSA0LjI1NC40MDQtMy4yMSAyLjg4Mi45NCA0LjI2eiIvPjwvc3ZnPg==" alt="" />
                        </div>
                        <div>{revie.starmess}</div>
                      </div>
                      <div>{revie.message}</div>
                      {/* <div className='w-[4vw]'><img src="https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/x/b/-original-imahf3bfjrttzuyt.jpeg?q=70" alt="" /></div> */}
                    </div>
                  ))}
                </div>
                :
                <div className='px-[2vw] text-xs'>Still No Reviews</div>}
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Page