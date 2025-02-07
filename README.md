# E-commerce Project with Next.js

This is a full-fledged e-commerce web application built with Next.js, featuring comprehensive authentication, user management, product browsing, shopping cart functionality, secure payment processing, and more.

## Features

* **Authentication:**
    * Google authentication
    * GitHub authentication
    * Email/password authentication
    * Forgot password with email verification
    * New user registration with email verification
* **User Profile:**
    * View and edit user information (username, email)
    * Wishlist
    * Order history
    * Notifications
    * Logout
* **Product Browsing:**
    * Browse products by category, etc. (implementation details can be added here)
    * "Buy Now" for single-item purchase
    * "Add to Cart" for multiple-item purchase
* **Shopping Cart:**
    * Add/remove products
    * Adjust quantities
* **Payment:**
    * Razorpay integration for secure payment processing
* **Reviews:**
    * Leave reviews on purchased products
    * Review links sent to registered email
* **Chatbot:**
    * Integrated chatbot powered by Gemini
* **Order Tracking:**
    * Basic order listing (future enhancement: detailed order tracking)

## Technologies Used

* Next.js
* React
* NextAuth.js (for authentication)
* Razorpay
* Gemini (for chatbot)
* MongoDB (database)
* Nodemailer (for sending emails)

## Deployment

* Deployed on Vercel

## Environment Variables

Make sure to set the following environment variables in your `.env.local` file:

```bash
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
Github_ID=<your_github_client_id>
Github_SECRET=<your_github_client_secret>
EMAIL_USER=<your_email_address>
EMAIL_PASS=<your_email_password>
NEXT_PUBLIC_KEY_ID=<your_razorpay_key_id>
NEXT_PUBLIC_KEY_SECRET=<your_razorpay_key_secret>
NEXT_PUBLIC_URL2=<your_app_url>
DATABASE_URL=<your_mongodb_connection_string>
NEXT_PUBLIC_GEMINI_API_KEY=<your_gemini_api_key>
NEXTAUTH_SECRET=<generate_a_random_secret>
'''




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



