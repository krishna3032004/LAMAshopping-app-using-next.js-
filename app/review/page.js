"use client"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function ReviewForm() {
    const searchParams = useSearchParams();
  let productId= searchParams.get("productId");
  const router = useRouter()
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [name, setname] = useState("");
  const [starmessage, setstarmessage] = useState("")
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();

    
    const formData = new FormData();
    formData.append("stars", stars);
    formData.append("namereviewer", name);
    formData.append("review", review);
    formData.append("starmess", starmessage);
    // formData.append("photo", photo);
    formData.append("productId", productId);

    const res = await fetch("/api/reviews", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push(`${process.env.NEXT_PUBLIC_URL2}/alldone`)
    } else {
      // alert("Error submitting review.");
      toast.warning('Something went wrong!', {
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

  const handleStarClick = (rating) => {

    setStars(rating);
    if(rating===1){
        setstarmessage("Poor!")
    }
    else if(rating===2){
        setstarmessage("Not Bad!")
    }
    else if(rating===3){
        setstarmessage("Good!")
    }
    else if(rating===4){
        setstarmessage("Great!")
    }
    else if(rating===5){
        setstarmessage("Highly Recommended!")
    }
  };

  return (
    <>
    {isLoading ? <div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay muted loop="loop" type="video/mp4"></video></div>
      :
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md my-[5vh]">
      <h2 className="sm:text-2xl text-xl font-semibold text-center text-gray-800 mb-4">
        Write a Review
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-3xl cursor-pointer transition ${
                stars >= star ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>
          <div className="text-center">{starmessage}</div>

        {/* Review Text */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Name:
          </label>
          <input
            id="name"
            className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="review" className="block text-gray-700 font-medium">
            Review:
          </label>
          <textarea
            id="review"
            className="w-full mt-2 sm:p-3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
          ></textarea>
        </div>

        {/* Photo Upload */}
        {/* <div>
          <label htmlFor="photo" className="block text-gray-700 font-medium">
            Upload Photo:
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-100 file:text-blue-700
            hover:file:bg-blue-200"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full sm:py-3 py-2 bg-blue-600 text-white font-bold text-sm sm:text-lg rounded-lg hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
      </form>
    </div>}
    </>
  );
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div className='flex justify-center items-center pt-[38vh] pb-[47vh]'><video className='max-w-[5vh]' src="https://cdnl.iconscout.com/lottie/free/preview/free-loading-animation-download-in-lottie-json-gif-static-svg-file-formats--refresh-reload-processing-load-user-interface-animations-4282536.mp4" autoPlay muted loop="loop" type="video/mp4"></video></div>}>
      <ReviewForm />
    </Suspense>
  );
}