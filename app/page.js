"use client"
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import { fetchfeatured } from "@/actions/useraction";
import { updateCart } from "@/actions/useraction";
import { useSession } from "next-auth/react";
import { fetchUser, updatewishlist } from "@/actions/useraction";
import ReactMarkdown from "react-markdown";
import { Send, Loader2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession()
  const [current, setcurrent] = useState(0);
  const [featured, setfeatured] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState("gray");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ischatopen, setischatopen] = useState(false)
  const [Loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(true);
  const [reverseAnimation, setReverseAnimation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    // Start hiding animation after 3 seconds
    const timer = setTimeout(() => {
      setReverseAnimation(true);
    }, 3000);

    // Fully hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowText(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    // ✅ Initial message from the bot when the chat loads
    setMessages([
      {
        sender: "bot",
        text: "👋 Hello! I'm Gemini, your AI assistant. Ask me anything about products, orders, or help with your shopping! 🛍️",
      },
    ]);
  }, []);

  const ecommerceContext = `
  Our e-commerce platform sells a variety of products including electronics, fashion, and home goods. 
  We offer free shipping on orders over $50 and a 30-day return policy. 
  We have customer service available through chat from 9 AM to 6 PM.
  
`;

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    // const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`).join('\n');

    // // Add the current user message to the history
    // const fullConversation = ecommerceContext + conversationHistory + `\nUser: ${input}`;

    const conversationHistory = messages.map(msg => msg.text).join('\n');

// Add the current user message to the history
const fullConversation = ecommerceContext + "\n" + conversationHistory + "\n" + input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullConversation }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.candidates?.[0]?.content.parts[0].text || "No response" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: Could not fetch response" }]);
    } finally {
      setLoading(false);
    }
  };

  const slides = [
    {
      id: 1,
      title: "abs",
      img: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/50ab47d8cd7d9ce1.jpg?q=20",
    },
    {
      id: 2,
      title: "aig",
      img: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/c928b14a5cddaf18.jpg?q=20",
    },
    {
      id: 3,
      title: "sihdk",
      img: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/21c72584989b09a9.jpg?q=20",
    },
    {
      id: 4,
      title: "sihdk",
      img: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/df71df999c4d6023.jpg?q=20",
    }
  ]

  const extendedSlides = [...slides, slides[0]];


  useEffect(() => {
    if (current === slides.length) {
        setTimeout(() => {
            setIsTransitioning(false); // Disable transition to jump instantly
            console.log("hello bhai")
            setcurrent(0);
        }, 1000); // Wait for transition to finish before resetting
    } else {
        setIsTransitioning(true);
    }
}, [current]);
  useEffect(() => {
    const interval = setInterval(() => {
      setcurrent((prev) => (prev + 1) );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
}, []);

  useEffect(() => {
    
      getfeatured()

    
  }, [])
  // useEffect(() => {
  //   if (status === "loading") {
  //     // Wait until session is loaded
  //     setIsLoading(true)

  //     // return;
  //   } else {
  //     getfeatured()

  //   }
  // }, [status])


 


 

  const getfeatured = async () => {
    setIsLoading(false)
    let b = await fetchfeatured()
    // let a = b.toObject({ flattenObjectIds: true })
    let a = JSON.parse(b);

    setfeatured(a)
    // setIsLoading(false)
  }

  const reloadPage = (url) => {
    window.location.href = url;
  };
  return (
    <>
      {isLoading ? <div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay="autoplay" muted loop="loop" type="video/mp4"></video></div>
        :
        <div onClick={() => setischatopen(false)} className="relative top-0 z-[0] min-h-screen w-[100vw] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
          {/* <Navbar /> */}
          <div className="      overflow-hidden text-black w-[82vw] m-auto rounded-md flex  object-fill  "  >
            <div className={`flex ${isTransitioning ? "transition-transform duration-1000" : "transition-transform duration-0"}`} style={{ transform: `translateX(-${current * 82}vw)` }}>
              {extendedSlides.map((slide, i) => (
                <div key={i} className=" w-[82vw] " >
                  <div className="w-[82vw] relative z-0">
                    <img className="w-full object-cover overflow-hidden  min-h-[15vh]  max-h-[30vh]" src={slide.img} alt="" />

                  </div>
                </div>
              ))
              }
            </div>





            {/* <img src={slides[0].img} loading="eager" alt="Image" className="w-[175vh] m-auto rounded-md"/> */}

          </div>
          <div className="absolute m-auto left-[42vw] sm:left-[47vw] flex gap-4">
            {slides.map((slide, index) => (
              <div key={index} className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${current % slides.length === index  ? "scale-150" : ""}`} onClick={() => setcurrent(index)}>
                {current % slides.length === index && (
                  <div className="w-[6px] h-[6px] bg-gray-600 cursor-pointer rounded-full"></div>
                )}
              </div>
            ))}
          </div>



          <div className=" text-black w-[81vw] m-auto my-10 ">
            <div className="font-semibold text-lg my-10">Featured Products</div>
            <div className="md:flex gap-[3vw] hidden ">
              {featured.map((produc, index) => {
                if (index < 6) {
                  return <div key={index} className="relative">
                    <Link href={`/product/${produc._id}`} target="_blank" rel="noopener noreferrer"><div key={produc.index} className=" w-[11vw]  border-[0.2vh] border-gray-300 p-[1vw]  ">
                      <div className="w-[100%] h-[70%] ">
                        <img className="h-[10vw]  object-cover overflow-hidden rounded-xl" alt="" src={produc.image} width={250} />
                      </div>
                      <div>
                        <div className="flex my-2 gap-[1vw] font-semibold text-[10px] md:text-sm justify-between">
                          <div className="max-h-[10vh] overflow-hidden text-ellipsis line-clamp-5 break-words" style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2, // Adjust the number of lines to fit the height
                          }}>{produc.name}</div>
                          <div className=" text-[9px] md:text-xs ">₹{produc.amount}</div>
                        </div>
                        {/* <div className=" text-xs text-zinc-400">Cozy knitwear essential.</div> */}
                      </div>
                    </div></Link>
                    {/* <div className='w-[5vh] h-[5vh] absolute left-[12vw] top-[1vh]  flex justify-center items-center  rounded-full'>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={async () => {
                        if (session) {
                          await handleClick(produc._id, produc.wishlist)
                        }
                        else {
                          alert("first do login")
                        }
                      }
                      } className={`cursor-pointer ${produc.wishlist ? 'opacity-100' : 'opacity-20'}`} width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill={produc.wishlist ? "#ff4343" : "#000"} fill-rule="evenodd" opacity=".9"></path></svg>
                    </div> */}
                    {/* <button onClick={(e) => updatecart(produc._id)} className="border-2 w-[6vw] rounded-full hover:bg-red-300 hover:text-white text-center border-red-300 text-red-300 text-xs py-1 my-3">Add to Cart</button> */}


                  </div>
                }
              }
                // )
              )
              }

            </div>
            <div className="md:hidden gap-[7vw] flex flex-wrap">
              {featured.map((produc, index) => {
                if (index < 6) {
                  return <div key={index} className="relative">
                    <Link href={`/product/${produc._id}`} target="_blank" rel="noopener noreferrer"><div key={produc.index} className=" w-[22vw]   ">
                      <div className="w-[100%] h-[70%]  ">
                        <img className="h-[30vw] object-cover overflow-hidden rounded-xl" alt="" src={produc.image} width={250} />
                      </div>
                      <div>
                        <div className="flex my-2 mb-1 gap-[1vw] font-semibold text-sm justify-between">
                          <div className="max-h-[10vh] text-[13px] overflow-hidden text-ellipsis line-clamp-5 break-words" style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2, // Adjust the number of lines to fit the height
                          }}>{produc.name}</div>
                          <div className="text-xs">₹{produc.amount}</div>
                        </div>
                        {/* <div className=" text-[10px] text-zinc-400">Free Delievery.</div> */}
                      </div>
                    </div></Link>
                    {/* <div className='w-[5vh] h-[5vh] absolute left-[12vw] top-[1vh]  flex justify-center items-center  rounded-full'>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={async () => {
                        if (session) {
                          await handleClick(produc._id, produc.wishlist)
                        }
                        else {
                          alert("first do login")
                        }
                      }
                      } className={`cursor-pointer ${produc.wishlist ? 'opacity-100' : 'opacity-20'}`} width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill={produc.wishlist ? "#ff4343" : "#000"} fill-rule="evenodd" opacity=".9"></path></svg>
                    </div> */}
                    {/* <button onClick={(e) => updatecart(produc._id)} className="border-2 w-[6vw] rounded-full hover:bg-red-300 hover:text-white text-center border-red-300 text-red-300 text-xs py-1 my-3">Add to Cart</button> */}


                  </div>
                }
              }
                // )
              )
              }

            </div>
          </div>
          <div className=" text-black w-[95vw] m-auto my-10 ">
            <div className="font-semibold my-10 text-lg px-[7vw]">Categories</div>

            <div className="flex gap-10 overflow-x-scroll  scrollbar-hide">
              {/* <Link href={"/Allproducts"}>
              <div className=" w-48  h-[44vh] flex-shrink-0 ">
                <img class="_53J4C-" alt="" src="https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/x/b/-original-imahf3bfjrttzuyt.jpeg?q=70" />
                <div className="py-3 text-sm">
                  All Products
                </div>
              </div>
            </Link> */}
              <Link href={"/bags"}><div className="w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw] h-80  flex-shrink-0 object-fill">
                <img className="w-[40vw] h-56 object-fill" alt="" src="https://rukminim2.flixcart.com/image/612/612/l27wtjk0/backpack/b/k/d/daypack-small-bags-backpack-for-daily-use-library-office-outdoor-original-imagdm57uh8ypdwb.jpeg?q=70" />
                <div className="py-3 text-sm">
                  Bags
                </div>
              </div></Link>
              <Link href={"/books"}><div className=" w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw] h-80  flex-shrink-0 object-fill ">
                <img className="w-[40vw]  h-56 object-fill" alt="" src="https://media.istockphoto.com/id/1031087940/photo/book_stack.jpg?s=612x612&w=0&k=20&c=XpsYj2yiHRfi6YYHDjayV3eWXuIUAAcUGcLi9MxoWhs=" />
                <div className="py-3 text-sm">
                  Books
                </div>
              </div></Link>
              <Link href={"/featured"}><div className=" w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw] h-80  flex-shrink-0 object-fill">
                <img className="w-[40vw]  h-56" alt="" src="https://rukminim2.flixcart.com/image/170/170/xif0q/watch/c/c/w/1-sk-pg-4078-wyt-brwn-basic-with-day-and-date-display-provogue-original-imah2wff4m8yczey.jpeg?q=80" />
                <div className="py-3 text-sm">
                  Featured
                </div>
              </div></Link>
              <Link href={"/homeitem"}><div className="w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw] h-80  flex-shrink-0 object-fill">
                <img className="w-[40vw]  h-56" alt="" src="https://rukminim2.flixcart.com/image/612/612/xif0q/rack-shelf/c/9/d/living-room-bedroom-1-asw44422-xtenshion-crafts-2-original-imah6nfkgggmh5uz.jpeg?q=70" />
                <div className="py-3 text-sm">
                  Items for House
                </div>
              </div></Link>
              <Link href={"/jeans"}><div className="w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw] h-80  flex-shrink-0 ">
                <img className="w-[40vw]  h-56" alt="" src="https://rukminim2.flixcart.com/image/612/612/xif0q/jean/p/4/k/32-blackdenim-n-club-original-imah3kdgvykzutns.jpeg?q=70" />
                <div className="py-3 text-sm">
                  Jeans
                </div>
              </div></Link>
              <Link href={"/shoes"}><div className="w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw]  h-80  flex-shrink-0 ">
                <img className="w-[40vw]  h-56" alt="" src="https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/d/f/3/6-ar-max-2-airson-white-cream-original-imahyyp27wadesjh.jpeg?q=70" />
                <div className="py-3 text-sm">
                  Shoes,sandals and sleeper for men and women
                </div>
              </div></Link>
              <Link href={"/tshirts"}><div className="w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw]  h-80  flex-shrink-0 ">
                <img className="w-[40vw]  h-56" alt="" src="https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/a/w/w/xxl-439420-bewakoof-original-imah7snxfthexusy.jpeg?q=70" />
                <div className="py-3 text-sm">
                  T-shirts
                </div>
              </div></Link>
              <Link href={"/accessories"}><div className=" w-[40vw] sm:w-[19vw] md:w-[17vw] lg:w-[15vw] h-80  flex-shrink-0 ">
                <img className="w-[40vw]  h-56" alt="" src="https://rukminim2.flixcart.com/image/416/416/xif0q/car-kit/car-bluetooth-converter/n/l/8/usb-bluetooth-v5-1-receiver-stereo-bluetooth-rca-usb-3-5mm-aux-original-imagxbywqgjwf6j2.jpeg?q=70&crop=false" />
                <div className="py-3 text-sm">
                  Accessories
                </div>
              </div></Link>


            </div>
          </div>
          <div className=" text-black w-[81vw] flex flex-col justify-center m-auto my-10 ">
            <div className="font-semibold my-10 text-lg">New Products</div>
            {/* <div className="flex justify-center items-center"> */}
            <div className="md:flex hidden gap-16  flex-wrap mb-40">
              {featured.map((produc, index) => {
                if (index >= 4 && index < 12) {
                  return <div key={index} className="relative">
                    <Link href={`/product/${produc._id}`} target="_blank" rel="noopener noreferrer"><div key={produc.index} className=" min-w-36 max-w-[20vw] lg:max-w-[15vw]  ">
                      <div className="w-[100%] h-[70%]">
                        <img className="h-[37vh] object-cover overflow-hidden" alt="" src={produc.image} width={250} />
                      </div>
                      <div>
                        <div className="flex my-2 gap-[1vw] font-semibold text-sm justify-between">
                          <div className="max-h-[10vh] overflow-hidden text-ellipsis line-clamp-5 break-words" style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3, // Adjust the number of lines to fit the height
                          }}>{produc.name}</div>
                          <div>₹{produc.amount}</div>
                        </div>
                        <div className=" text-xs text-zinc-400">Cozy knitwear essential.</div>
                      </div>
                    </div></Link>
                    {/* <div className='w-[5vh] h-[5vh] absolute left-[12vw] top-[1vh]  flex justify-center items-center  rounded-full'>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={async () => {
                        if (session) {
                          await handleClick(produc._id, produc.wishlist)
                        }
                        else {
                          alert("first do login")
                        }
                      }
                      } className={`cursor-pointer ${produc.wishlist ? 'opacity-100' : 'opacity-20'}`} width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill={produc.wishlist ? "#ff4343" : "#000"} fill-rule="evenodd" opacity=".9"></path></svg>
                    </div> */}
                    {/* <div onClick={(e) => {

                      updatecart(produc._id)
                    }} className="border-2 w-[6vw] cursor-pointer rounded-full hover:bg-red-300 hover:text-white text-center border-red-300 text-red-300 text-xs py-1 my-3">Add to Cart</div> */}
                  </div>
                }
              }
                // )
              )}

            </div>
            <div className="flex gap-[12vw] md:hidden flex-wrap mb-40">
              {featured.map((produc, index) => {
                if (index >= 6 && index < 14) {
                  return <div key={index} className="relative">
                    <Link href={`/product/${produc._id}`} target="_blank" rel="noopener noreferrer"><div key={produc.index} className=" w-[34vw]   ">
                      <div className="w-[100%] h-[70%]">
                        <img className="h-[40vw] object-cover overflow-hidden" alt="" src={produc.image} width={250} />
                      </div>
                      <div>
                        <div className="flex my-2 gap-[1vw] font-semibold text-sm justify-between">
                          <div className="max-h-[10vh] text-[13px] overflow-hidden text-ellipsis line-clamp-5 break-words" style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2, // Adjust the number of lines to fit the height
                          }}>{produc.name}</div>
                          <div>₹{produc.amount}</div>
                        </div>
                        {/* <div className=" text-xs text-zinc-400">Cozy knitwear essential.</div> */}
                      </div>
                    </div></Link>
                    {/* <div className='w-[5vh] h-[5vh] absolute left-[12vw] top-[1vh]  flex justify-center items-center  rounded-full'>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={async () => {
                        if (session) {
                          await handleClick(produc._id, produc.wishlist)
                        }
                        else {
                          alert("first do login")
                        }
                      }
                      } className={`cursor-pointer ${produc.wishlist ? 'opacity-100' : 'opacity-20'}`} width="24" height="24" viewBox="0 0 20 16"><path d="M8.695 16.682C4.06 12.382 1 9.536 1 6.065 1 3.219 3.178 1 5.95 1c1.566 0 3.069.746 4.05 1.915C10.981 1.745 12.484 1 14.05 1 16.822 1 19 3.22 19 6.065c0 3.471-3.06 6.316-7.695 10.617L10 17.897l-1.305-1.215z" fill={produc.wishlist ? "#ff4343" : "#000"} fill-rule="evenodd" opacity=".9"></path></svg>
                    </div> */}
                    {/* <div onClick={(e) => {

                      updatecart(produc._id)
                    }} className="border-2 w-[6vw] cursor-pointer rounded-full hover:bg-red-300 hover:text-white text-center border-red-300 text-red-300 text-xs py-1 my-3">Add to Cart</div> */}
                  </div>
                }
              }
                // )
              )}

            </div>
          </div>
          {/* <Footer /> */}
        </div>
      }
      {ischatopen &&

        <div className={`fixed z-50 right-2 mx-4 bottom-20 flex flex-col  max-w-lg bg-white text-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-300 transform transition-all duration-300  ease-in-out ${ischatopen ? "scale-[1] opacity-100" : "scale-[0.8] opacity-0"}`}>
          {/* Header */}
          <div className="bg-black text-white text-center py-3  font-semibold">
            Chat with AI
          </div>

          {/* Chat Messages */}
          <div className="flex flex-col gap-2 p-4 overflow-y-auto h-96 bg-gray-100">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 text-xs sm:text-sm max-w-xs rounded-2xl ${msg.sender === "user"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-900"
                    }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown> {/* ✅ Properly renders markdown */}
                </div>
              </div>
            ))}
            {Loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 text-sm bg-gray-200 text-gray-900 rounded-xl flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="border-t border-gray-300 p-3 flex items-center gap-2 bg-white">
            <input
              type="text"
              className="flex-1 p-1 rounded-lg bg-gray-200 text-gray-900 border border-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
              onClick={sendMessage}
              disabled={Loading}
            >
              {Loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      }
      {/* <div onClick={() => setischatopen(!ischatopen)} className="fixed z-50 rounded-full flex p-2 cursor-pointer  right-3 bottom-6 bg-black text-white">
        <img className="bg-white w-8 rounded-full h-8 invert" src="https://cdn.iconscout.com/icon/free/png-512/free-chat-icon-download-in-svg-png-gif-file-formats--cloud-speech-talk-text-user-interface-pack-icons-83557.png?f=webp&w=256" alt="" />
        
      </div> */}
       <div
      onClick={() => setischatopen(!ischatopen)}
      className="fixed z-50 flex items-center right-3 bottom-6 cursor-pointer"
    >
      {/* Chat text animation */}
      {showText && (
        <div className={`bg-black text-white px-3 py-2 rounded-lg text-sm font-semibold
          ${reverseAnimation ? "animate-slide-out" : "animate-slide-in"}`}>
          Chat with AI
        </div>
      )}

      {/* Chat button */}
      <div className="rounded-full flex p-2 bg-black text-white ml-2">
        <img
          className="bg-white w-8 rounded-full h-8 invert"
          src="https://cdn.iconscout.com/icon/free/png-512/free-chat-icon-download-in-svg-png-gif-file-formats--cloud-speech-talk-text-user-interface-pack-icons-83557.png?f=webp&w=256"
          alt=""
        />
      </div>
    </div>
    </>
  );
}
