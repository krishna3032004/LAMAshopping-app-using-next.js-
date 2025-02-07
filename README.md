This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.




E-commerce Website (Next.js)

Overview

This is a fully functional E-commerce website built using Next.js with a robust authentication system, product purchasing options, payment integration, and chatbot support.

Features

Authentication

Login/Signup with Google, GitHub, and Email & Password

Email Verification via OTP (for registration & password reset)

Session-based authentication using NextAuth.js

User Account Management

View & edit Username, Email

Wishlist: Save favorite products

Orders: View past purchases (No tracking implemented)

Notifications: Get updates on purchases

Logout option available

Product Purchasing

Buy Now: Direct purchase of a product

Add to Cart: Add multiple products & checkout later

Reviews: Submit product reviews (only for purchased items, via email link)

Payments

Integrated with Razorpay for seamless checkout

Chatbot

AI chatbot powered by Google Gemini API for user assistance

Tech Stack

Frontend: Next.js, React.js, Tailwind CSS

Backend: Next.js API Routes

Database: MongoDB (MongoDB Atlas)

Authentication: NextAuth.js

Payments: Razorpay

AI Chatbot: Google Gemini API

Deployment: Vercel

Environment Variables

Create a .env.local file and add the following variables:

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
EMAIL_USER=
EMAIL_PASS=
NEXT_PUBLIC_KEY_ID=
NEXT_PUBLIC_KEY_SECRET=
NEXT_PUBLIC_URL2=
DATABASE_URL=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXTAUTH_SECRET=

Deployment

Clone the repository:

git clone https://github.com/yourusername/your-repo.git
cd your-repo

Install dependencies:

npm install

Set up environment variables (.env.local as shown above)

Run the development server:

npm run dev

Deploy on Vercel:

Push your project to GitHub

Connect it with Vercel

Add environment variables in Vercel's dashboard

How to Use

Signup/Login using Google, GitHub, or email.

Browse products and either "Buy Now" or "Add to Cart".

Proceed to Checkout and complete payment via Razorpay.

Access Your Orders, Wishlist, and Notifications in the profile.

Use the AI Chatbot for assistance.

Contributing

Feel free to fork this project and submit pull requests!

License

This project is open-source under the MIT License.

