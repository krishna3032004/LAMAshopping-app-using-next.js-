// import multer from 'multer';
// import nc from 'next-connect';
// import { saveReview } from '../../lib/db'; // Your DB logic
// import { uploadPhoto } from '../../lib/upload'; // Your photo upload logic
import { NextResponse } from "next/server";
import { saveReview } from "@/actions/useraction";

// const upload = multer({ dest: '/tmp/uploads' });

export const POST = async (req) => {
    //   use(upload.single('photo'))
    //   .post(async (req, res) => {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries()); // Convert formData to an object

        console.log("Received Review:", body);

        // Validate required fields
        const { stars, review, productId,namereviewer,starmess } = body;
        if (!stars || !review || !productId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

          await saveReview({
            productId,
            stars: parseInt(stars),
            review,
            namereviewer,
            starmess,
            // photoUrl,
          });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL2}/alldone`)
    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }

        );
    }
    //   });
}

// export const config = {
//   api: {
//     bodyParser: false, // Required for multer
//   },
// };

// export default handler;