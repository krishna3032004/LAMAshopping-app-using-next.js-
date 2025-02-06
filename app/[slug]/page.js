"use client"
import React from 'react'
import Link from 'next/link'
import { getproducts } from '@/actions/useraction'
import { useEffect, useState } from 'react'
import { updateCart, fetchCart, fetchUser, updatewishlist } from '@/actions/useraction'
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Page = ({ params }) => {
  const { data: session, status } = useSession()
  let [products, setproducts] = useState([])
  const [count, setcount] = useState(12)
  const [count2, setcount2] = useState(0)
  const [first, setfirst] = useState(0)
  const [isFormComplete, setisFormComplete] = useState(false)
  const [isFormComplete2, setisFormComplete2] = useState(false)
  const [IsLoading, setIsLoading] = useState(true)
  const [showdropdown, setshowdropdown] = useState(false)
  const [sort, setsort] = useState("Sort By")
  useEffect(() => {
    if (status === "loading") {
      // Wait until session is loaded
      setIsLoading(true)

      // return;
    } else {
      let a = params.slug
      setIsLoading(true)
      getproduct()
    }
  }, [count, count2, status])

  const getproduct = async () => {
    let b = await getproducts(params.slug)
    let a = JSON.parse(b);
    if (count < a.length) {
      setisFormComplete(true)
    }
    else {
      setisFormComplete(false)

    }
    if (count2 === 0) {
      setisFormComplete2(false)
    }

    let wishlistIds = []
    if (session) {
      let h = await fetchUser(session.user.email)
      for (let value of h.wishlist) {
        wishlistIds.push(value)

      }
    }



    const updatedItems = a.map((item) => ({
      ...item,
      wishlist: wishlistIds.includes(item._id), // Set wishlist to true if _id is in wishlistIds
    }));

    setproducts(updatedItems)
    setIsLoading(false)
  }

  const handleClick = async (id, wishlist) => {
    if (session) {
      toast.dismiss();
      setproducts((prevproducts) =>
        prevproducts.map((item) =>
          item._id === id ? { ...item, wishlist: !wishlist } : item
        )
      );
      let color = "gray"

      if (wishlist) {
        color = "#ff4343"
      }
      await updatewishlist(session.user.email, id, color)
      if (!wishlist) {
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
  };

  const updatecart = async (id) => {
    if (session) {
      toast.dismiss();
      let b = await fetchCart(session.user.email)
      let a = JSON.parse(b);
      let isMatch = a.some(item => item.product === id);
      if (!isMatch) {
        await updateCart(session.user.email, id, 1)
        toast.success('Added to your Cart!', {
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

      } else {
        toast.warning('Already in Cart!', {
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
      // alert("product is add too cart")
      // setcart(true)
    }
    else {
      toast.warning('First do Login!', {
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

      {IsLoading ? <div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh] bg-transparent' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay="autoplay" muted loop="loop" type="video/mp4"></video></div>
        :
        <div>
          {params.slug === "featured" &&
            <div className=' overflow-hidden text-black w-[82vw] m-auto rounded-md'>
              <img className="object-cover w-full overflow-hidden  min-h-[15vh]  max-h-[48vh] rounded-md" alt="htr" srcSet="https://rukminim2.flixcart.com/fk-p-flap/3600/3600/image/78ce5779a84682f3.jpg?q=80 2x, https://rukminim2.flixcart.com/fk-p-flap/1800/1800/image/78ce5779a84682f3.jpg?q=80 1x" src="https://rukminim2.flixcart.com/fk-p-flap/1800/1800/image/78ce5779a84682f3.jpg?q=80" data-tkid="M_1b0311ca-82c0-40e3-a00f-0bae18ec493b_1.UNLUAMK7KBYE" />
            </div>
          }
          <div>
            <div className=" text-black w-[81vw] m-auto py-10 ">
              <div className='flex relative justify-between mb-[5vh]'>
                <div className="font-semibold text-base">{params.slug}</div>
                <button onClick={() => { setshowdropdown(!showdropdown) }} onBlur={() => { setTimeout(() => { setshowdropdown(false) }, 200); }} id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" className="flex gap-1  text-black px-2 w-32 lg:w-[11vw]  justify-between py-1 border-[0.1vh]  shadow-sm shadow-slate-500 cursor-pointer font-medium rounded-full text-xs lg:text-sm outline-none items-center " type="button">

                  <div className='  text-black text-[10px] lg:text-sm '>
                    {sort}
                  </div>
                  <svg className="w-2.5 h-2.5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>

                </button>
                <div id="dropdownAvatarName" className={`z-10 ${showdropdown ? "" : "hidden"} absolute top-[3vh] sm:top-[5vh] right-[-1vw] shadow-slate-300 bg-slate-700 divide-y divide-slate-600 rounded-lg shadow w-32 sm:w-40 md:w-44  `}>
                  {/* <div className="px-4 py-3 text-sm text-gray-900 font-medium ">
              Pro User
            </div> */}
                  <div onClick={() => setsort("Sort By")} className='flex items-center rounded-t-lg cursor-pointer text-xs sm:text-sm text-white hover:bg-slate-600 pl-[1vw] py-[0.5vh]'>
                    Sort By
                  </div>
                  <div onClick={() => {
                    setsort("Price (low to high)")
                    products = products.slice().sort((a, b) => a.amount - b.amount)
                    setproducts(products)
                  }
                  } className='flex items-center cursor-pointer text-xs sm:text-sm text-white  hover:bg-slate-600 pl-[1vw] py-[0.5vh]'>
                    Price (low to high)
                  </div>
                  <div onClick={() => {
                    setsort("Price (high to low)")
                    products = products.slice().sort((a, b) => b.amount - a.amount)
                    setproducts(products)
                  }
                  } className='flex items-center cursor-pointer text-xs sm:text-sm rounded-b-lg text-white hover:bg-slate-600 pl-[1vw] py-[0.5vh]'>
                    Price (high to low)
                  </div>
                </div>
              </div>
              {products.length != 0 ?
              <div>
                <div className="md:flex hidden gap-16 flex-wrap">
                  {products.map((produc, index) => {
                    if (index >= count2 && index < count) {
                      return <div key={index} className='relative'>
                        <Link href={`/product/${produc._id}`} target="_blank" rel="noopener noreferrer"><div key={produc.index} className="min-w-36 max-w-[21vw] lg:max-w-[15vw]">
                          <div className="w-[100%] h-[70%]">
                            <img className="h-[37vh] object-cover overflow-hidden" alt="" src={produc.image} width={250} />
                          </div>
                          <div>
                            <div className="flex my-2 font-semibold text-sm justify-between">
                              <div className="max-h-[10vh] overflow-hidden text-ellipsis line-clamp-5 break-words" style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2, // Adjust the number of lines to fit the height
                              }}>{produc.name}</div>
                              <div>₹{produc.amount}</div>
                            </div>
                            <div className=" text-xs text-zinc-400">Cozy knitwear essential.</div>
                          </div>
                        </div></Link>
                        <div className='w-[7vh] h-[7vh] absolute left-[17vw] top-[0vh]  lg:left-[12vw] lg:top-[1vh]  flex justify-center items-center  rounded-full'>
                          <svg xmlns="http://www.w3.org/2000/svg" onClick={async () => {
                            if (session) {
                              await handleClick(produc._id, produc.wishlist)

                            }
                            else {
                              toast.dismiss();
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
                          } className={`cursor-pointer ${produc.wishlist ? 'opacity-100' : 'opacity-20'}`} width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill={produc.wishlist ? "#ff4343" : "#000"} fillRule="evenodd" opacity=".9"></path></svg>
                        </div>
                        <div onClick={(e) => {

                          updatecart(produc._id)
                        }} className="border-2 w-20 cursor-pointer rounded-full hover:bg-red-300 hover:text-white text-center border-red-300 text-red-300 text-xs py-1 my-3">Add to Cart</div>
                      </div>
                    }
                    // else if(index >=count){
                    //   setcount(24)
                    //   setcount2(12)
                    // }
                  })}
                </div>
                <div className="md:hidden flex gap-[12vw] flex-wrap">
                  {products.map((produc, index) => {
                    if (index >= count2 && index < count) {
                      return <div key={index} className='relative'>
                        <Link href={`/product/${produc._id}`} target="_blank" rel="noopener noreferrer"><div key={produc.index} className="w-[34vw]">
                          <div className="w-[100%] h-[70%]">
                            <img className="h-[40vw] object-cover overflow-hidden" alt="" src={produc.image} width={250} />
                          </div>
                          <div>
                            <div className="flex my-2 font-semibold text-sm justify-between">
                              <div className="max-h-[10vh] text-[12px] sm:text-[13px] overflow-hidden text-ellipsis line-clamp-5 break-words" style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2, // Adjust the number of lines to fit the height
                              }}>{produc.name}</div>
                              <div>₹{produc.amount}</div>
                            </div>
                            <div className="text-[8px] sm:text-xs text-zinc-400">Cozy knitwear essential.</div>
                          </div>
                        </div></Link>
                        <div className='w-[5vh] h-[5vh] absolute left-[25vw] top-[0vh]  flex justify-center items-center  rounded-full'>
                          <svg xmlns="http://www.w3.org/2000/svg" onClick={async () => {
                            if (session) {
                              await handleClick(produc._id, produc.wishlist)

                            }
                            else {
                              toast.dismiss();
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
                          } className={`cursor-pointer ${produc.wishlist ? 'opacity-100' : 'opacity-20'}`} width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill={produc.wishlist ? "#ff4343" : "#000"} fillRule="evenodd" opacity=".9"></path></svg>
                        </div>
                        <div onClick={(e) => {

                          updatecart(produc._id)
                        }} className="border-[1px] w-12 sm:w-20 cursor-pointer rounded-full hover:bg-red-300 hover:text-white text-center border-red-300 text-red-300 text-[7px] sm:text-[11px]  py-1 my-3">Add to Cart</div>
                      </div>
                    }
                    // else if(index >=count){
                    //   setcount(24)
                    //   setcount2(12)
                    // }
                  })}
                </div>
</div>



                :
                <div className='flex justify-center items-center my-[25vh]'>{"We couldn't find any matches for your search"}  {params.slug}</div>}
              {products.length != 0 &&
                <div className='flex justify-between mt-[10vh]'>
                  <div>
                    <div disabled={!isFormComplete2} onClick={() => {
                      setcount(count - 12)
                      setcount2(count2 - 12)
                    }} className={`rounded-md cursor-pointer px-4 py-1 text-white ${isFormComplete2 ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}`}>previous</div>
                  </div>
                  <div>
                    <div disabled={!isFormComplete} onClick={() => {
                      setcount(count + 12)
                      setcount2(count2 + 12)
                      setisFormComplete2(true)
                    }} className={`rounded-md cursor-pointer px-4 py-1 text-white ${isFormComplete ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}`}>next</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Page