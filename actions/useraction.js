'use server'
import connectDB from "@/app/db/connectDB";
import Product from "@/app/models/Product";
import User from "@/app/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "@/app/models/Payment";


import React from 'react'
import { error } from "console";
let verificationToken
export const initiatepayment = async (amount, email, form) => {
    await connectDB()

    let add = `${form.address} ,${form.city} ${form.state} ${form.postalCode}`
    const id = process.env.NEXT_PUBLIC_KEY_ID
    const Secret = process.env.NEXT_PUBLIC_KEY_SECRET

    var instance = new Razorpay({ key_id: id, key_secret: Secret })
    let options = {
        amount: Number.parseInt(amount) * 100,
        currency: "INR"
    }
    let x = await instance.orders.create(options)
    await Payment.create({ oid: x.id, amount: amount, email: email, address: add, phone: form.phone, name: form.name })
    return x;


    
}

export const getproducts = async (slug) => {
    await connectDB()
    let c = slug.toLowerCase().split("%20")
    let a, b
    for (let value of c) {
        if (value === "tshirts" || value === "shirt" || value === "shirts" || value === "tshirt") {
            value = "tshirts"
        }
        if (value === "watch" || value === "watches" || value === "smartwatch" || value === "smartwatches" || value === "analogwatches" || value === "analogwatch") {
            value = "watch"
        }
        if (value === "featured") {
            a = await Product.find({ featured: true });

        }
        else {
            a = await Product.find({ type: value });

        }
        b = JSON.stringify(a)
        if (a[0]) {
            return b;

        }
    }
    return b
}
export const fetchProduct = async (id) => {
    await connectDB()
    let a = await Product.findOne({ _id: id });
    let b = a.toObject({ flattenObjectIds: true })
    return b;
}
export const fetchfeatured = async () => {
    await connectDB()
    let a = await Product.find({ featured: true });

    let b = JSON.stringify(a)
    return b;
}
export const getorder = async (oid) => {
    await connectDB()
    let a = await Payment.findOne({ oid: oid });

    let order = a.toObject({ flattenObjectIds: true })
    return order;
}
export const fetchProductbyid = async (productid) => {
    await connectDB()
    let b = []
    for (let value of productid) {
        let a = await Product.findOne({ _id: value.product })
        b.push(a)
    }
    let t = JSON.stringify(b)
    return t

}
export const fetchProductbyidforcheckout = async (productid) => {
    await connectDB()
    let b = []
    for (let value of productid) {
        let a = await Product.findOne({ _id: value })
        b.push(a)
    }
    let t = JSON.stringify(b)
    return t

}
export const fetchProductfororder = async (orders) => {
    await connectDB()
    let b = []
    for (let value of orders) {
        let a = await Product.findOne({ _id: value.product })
        let o = await Payment.findOne({ oid: value.orderid, done: true })


        let z = a.toObject({ flattenObjectIds: true })
        z.quantity = value.quantity
        z.address = o.address
        z.customername = o.name
        z.phone = o.phone

        b.push(z)
    }
    let c = JSON.stringify(b)

    return c

}







export const fetchProductforwishlist = async (productid) => {
    await connectDB();
    let b = [];
    for (let value of productid) {
        let a = await Product.find({ _id: value });
        b.push(a[0]);
    }
    return JSON.stringify(b);
};

export const fetchCart = async (email) => {
    await connectDB();
    let a = await User.findOne({ email: email });
    return JSON.stringify(a.cart);
};

export const fetchcheckout = async (email) => {
    await connectDB();
    let a = await User.findOne({ email: email });
    return a.checkout.toObject({ flattenObjectIds: true });
};

export const putcheckout = async (email, productid, quantity) => {
    let a = await User.findOne({ email: email });
    a.checkout.unshift({ product: productid, quantity: quantity });
    await a.save();
    return a.toObject({ flattenObjectIds: true });
};

export const fetchUser = async (email) => {
    await connectDB();
    let a = await User.findOne({ email: email });
    if (a == null) {
        return a;
    }
    return a.toObject({ flattenObjectIds: true });
};

export const initiate = async (ndata) => {
    await connectDB();
    await Product.create({ name: ndata.name, type: ndata.type, message: ndata.message, amount: ndata.amount, old_amount: ndata.oldamount, quantity: ndata.quantity, image: ndata.image, featured: ndata.featured });
};

export const createUser = async (email, password, username) => {
    await connectDB();
    await User.create({ email: email, password: password, username: username });
};

export const updateProfile = async (email, password) => {
    await connectDB();
    await User.updateOne({ email: email }, { password: password });
};

export const updateProfilefull = async (data) => {
    await connectDB();
    await User.updateOne({ email: data.email }, data);
};

export const updateCart = async (userId, productId, quantity) => {
    const user = await User.findOne({ email: userId });
    const cartItem = await user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        user.cart.push({ product: productId, quantity });
    }
    await user.save();
};

export const removeproductfromcart = async (email, productid) => {
    connectDB();
    let a = await User.findOne({ email: email });
    a.cart = a.cart.filter(item => !item.product.equals(productid));
    await a.save();
    return JSON.stringify(a.cart);
};

export const removeproductfromwishlist = async (email, productid) => {
    connectDB();
    let a = await User.findOne({ email: email });
    a.wishlist = a.wishlist.filter(item => !item.equals(productid));
    await a.save();
    return JSON.stringify(a.wishlist);
};

export const changequantityfromcart = async (cart, email) => {
    cart.reverse();
    let a = await User.findOne({ email: email });
    a.cart = cart;
    await a.save();
};

export const decreaseproduct = async (cart, email, oid) => {
    let b = await User.findOne({ email: email });
    for (let value of cart) {
        let a = await Product.findOne({ _id: value.product });
        a.quantity -= value.quantity;
        await a.save();
        b.order.push({ product: value.product, quantity: value.quantity, orderid: oid });
    }
    b.cart = [];
    await b.save();
};

export const decreaseproductfromcheckout = async (email, oid) => {
    try {
        let b = await User.findOne({ email: email });
        let a = await Product.findOne({ _id: b.checkout[0].product });
        a.quantity -= b.checkout[0].quantity;
        b.order.push({ product: b.checkout[0].product, quantity: b.checkout[0].quantity, orderid: oid });
        b.checkout = [];
        await a.save();
        await b.save();
    } catch (e) {
        return {
            redirect: {
                destination: '/error?message=' + encodeURIComponent(e.message),
                permanent: false,
            },
        };
    }
};

export const checkcart = async (email, productid) => {
    await connectDB();
    let a = await User.findOne({ email: email });
    return a.cart.some(value => value.product.toString() === productid);
};

export const updatewishlist = async (email, productid, color) => {
    const a = await User.findOne({ email: email });
    if (color === "gray") {
        a.wishlist.push(productid);
    } else {
        a.wishlist = a.wishlist.filter(item => !item.equals(productid));
    }
    await a.save();
};

export const verify = async (email, password) => {
    await connectDB();
    const user = await fetchUser(email);
    if (!user) {
        return "Invalid Email!";
    }
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
        return "Invalid Password!";
    }
    return false;
};

export const registerUser = async (email) => {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return "User already exists";
    }
    await sendVerificationEmail(email);
    return true;
};

export const sendVerificationEmail = async (email) => {
    verificationToken = crypto.randomBytes(3).toString("hex");
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification Code",
        html: `<div><div className="text-xs">Hi ,</div><div className="text-xs">Go back to the site and enter this code to confirm your email.</div><h1>Email Verification Code: ${verificationToken}</h1></div>`,
    };
    await transporter.sendMail(mailOptions);
};

export const resetPassword = async (email) => {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return "User don't exists";
    }
    await sendotpforforgoting(email);
    return true;
};



// export const fetchProductforwishlist = async (productid) => {
//     await connectDB()
//     let b = []
//     // console.log(productid)
//     for (let value of productid) {
//         // console.log(value.product)
//         let a = await Product.find({ _id: value })

//         // console.log(a[0])
//         b.push(a[0])
//     }
//     // console.log(b)
//     let c = JSON.stringify(b)
//     // console.log(t)
//     return c

// }
// export const fetchCart = async (email) => {
//     await connectDB()
//     let a = await User.findOne({ email: email });

//     let b = JSON.stringify(a.cart)
//     return b
// }
// export const fetchcheckout = async (email) => {
//     await connectDB()
//     let a = await User.findOne({ email: email });
//     let b = a.checkout.toObject({ flattenObjectIds: true })
//     return b
// }
// export const putcheckout = async (email, productid, quantity) => {
//     let a = await User.findOne({ email: email })
//     a.checkout.unshift({ product: productid, quantity: quantity })
//     await a.save()
//     let user = a.toObject({ flattenObjectIds: true })
//     return user
// }
// export const fetchUser = async (email) => {
//     await connectDB()
//     let a = await User.findOne({ email: email })
//     if (a == null) {
//         return a
//     }
//     // alert(a)
//     let user = a.toObject({ flattenObjectIds: true })
//     return user
// }
// export const initiate = async (ndata) => {
//     await connectDB()
//     // let ndata = Object.fromEntries(data)
//     // console.log(ndata)
//     // console.log("hello man submitkyuu ni ho rha")
//     await Product.create({ name: ndata.name, type: ndata.type, message: ndata.message, amount: ndata.amount, old_amount: ndata.oldamount, quantity: ndata.quantity, image: ndata.image, featured: ndata.featured })
//     // return a;
// }
// export const createUser = async (email, password, username) => {
//     await connectDB()
//     await User.create({ email: email, password: password, username: username, })
// }
// export const updateProfile = async (email, password) => {
//     await connectDB()
//     // let ndata = Object.fromEntries(data)
//     // console.log(ndata)
//     // if (oldusername !== ndata.username) {
//     //     const u = await User.findOne({ username: ndata.username })
//     //     if (u) {
//     //         return { error: "username already exist" }
//     //     }
//     // }
//     await User.updateOne({ email: email }, { password: password })
//     // await User.updateOne({ email: ndata.email }, ndata)
//     // await Payment.updateMany({ to_User: oldusername }, { to_User: ndata.username })
// }
// // export const updateCart = async (email,name)=>{
// export const updateProfilefull = async (data) => {
//     await connectDB()
//     // let ndata = Object.fromEntries(data)
//     // console.log(data)
//     // console.log(data._id)

//     await User.updateOne({ email: data.email }, data)
// }

// // }
// export const updateCart = async (userId, productId, quantity) => {
//     const user = await User.findOne({ email: userId });
//     // console.log(user)
//     // try{
//     // console.log(user)
//     const cartItem = await user.cart.find(item => item.product.toString() === productId);
//     // }
//     // catch(e){
//     //     user.cart.push({ product: productId, quantity });
//     // }

//     if (cartItem) {
//         cartItem.quantity += quantity;
//     } else {
//         user.cart.push({ product: productId, quantity });
//     }
//     // console.log(user)
//     // user.markModified('cart');

//     // console.log(user)
//     const result = await user.save();
//     // console.log('Save result:', result);
//     // console.log(result.cart);
//     // await user.save().catch(err => {
//     //     console.error('Error saving user:', err);
//     //     throw err;
//     // });
// }
// export const removeproductfromcart = async (email, productid) => {
//     connectDB()
//     let a = await User.findOne({ email: email })
//     // console.log(a.cart)
//     for (let value of a.cart) {
//         // console.log(value.product)
//         if (value.product.toString() === productid) {
//             a.cart = a.cart.filter(item => !item.product.equals(value.product));
//         }
//     }
//     // console.log(a.cart)
//     const result = await a.save();
//     let b = JSON.stringify(a.cart)
//     return b
//     // return a.cart

// }
// export const removeproductfromwishlist = async (email, productid) => {
//     connectDB()
//     let a = await User.findOne({ email: email })
//     // console.log(a.cart)
//     for (let value of a.wishlist) {
//         // console.log(value.product)
//         if (value.toString() === productid) {
//             a.wishlist = a.wishlist.filter(item => !item.equals(value));
//         }
//     }
//     // console.log(a.cart)
//     const result = await a.save();
//     let b = JSON.stringify(a.wishlist)
//     return b
//     // return a.cart

// }
// export const changequantityfromcart = async (cart, email) => {
//     cart.reverse()
//     let a = await User.findOne({ email: email })
//     a.cart = cart
//     await a.save()
// }
// export const decreaseproduct = async (cart, email, oid) => {
//     // console.log(cart)
//     let b = await User.findOne({ email: email })
//     for (let value of cart) {
//         // console.log(value)
//         // console.log("kaye re je ka hai raho hai")
//         let a = await Product.findOne({ _id: value.product })
//         a.quantity = a.quantity - value.quantity
//         await a.save()
//         b.order.push({ product: value.product, quantity: value.quantity, orderid: oid })
//         // console.log(b)
//         // console.log(a)
//         // console.log(a)
//         // console.log()
//     }



//     b.cart = []
//     await b.save()
// }
// export const decreaseproductfromcheckout = async ( email, oid) => {
//     // console.log(cart)
//     try {

//         let b = await User.findOne({ email: email })
//         // console.log("abh bta kya hai yeh", h)
//         // for(let value of cart){
//         // console.log(value)
//         // console.log("kaye re je ka hai raho hai")
//         let a = await Product.findOne({ _id: b.checkout[0].product })
//         a.quantity = a.quantity - b.checkout[0].quantity
//         b.order.push({ product: b.checkout[0].product, quantity: b.checkout[0].quantity, orderid: oid })
//         // console.log(b)
//         b.checkout = []
//         // console.log(a)
//         // console.log(a)
//         // console.log()
//         // }



//         // console.log("yeh bhi", h)
//         // b.cart = []
//         await a.save()
//         await b.save()
//         // return h
//     }
//     catch (e) {
//         return {
//             redirect: {
//                 destination: '/error?message=' + encodeURIComponent(e.message),
//                 permanent: false,
//             },
//         };
//     }
//     // return h
// }


// export const checkcart = async (email, productid) => {
//     await connectDB()
//     let a = await User.findOne({ email: email })
//     // console.log(a.cart)
//     // console.log(a.cart[0].product.toString())
//     for (let value of a.cart) {
//         // console.log(value.product)
//         if (value.product.toString() === productid) {
//             return true
//         }
//     }
//     return false
// }
// export const updatewishlist = async (email, productid, color) => {
//     const a = await User.findOne({ email: email });
//     // console.log(user)
//     console.log(productid)
//     console.log(color)
//     if (color === "gray") {
//         a.wishlist.push(productid);
//     }
//     else {
//         for (let value of a.wishlist) {
//             console.log(value)
//             if (value.toString() === productid) {
//                 a.wishlist = a.wishlist.filter(item => !item.equals(value));
//             }
//         }
//     }
//     // try{
//     // console.log(user)
//     // const cartItem = await user.wishlist.find(item => item.product.toString() === productId);
//     // }
//     // catch(e){
//     //     user.cart.push({ product: productId, quantity });
//     // }

//     // console.log(user)
//     const result = await a.save();
// }





// export const verify = async (email, password) => {
//     await connectDB()
//     const user = await fetchUser(email);
//     if (!user) {
//         return "Invalid Email!"
//     }

//     const isPasswordValid = password === user.password;

//     if (!isPasswordValid) {
//         return "Invalid Password!"
//     }
//     return false
// }
// export const registerUser = async (email) => {
//     await connectDB();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         return "User already exists"
//         // throw new Error("User already exists");
//     }
//     // Generate a verification token
//     // verificationToken = crypto.randomBytes(3).toString("hex");
//     // console.log(verificationToken)
//     // Create a new user
//     // const newUser = new User({
//     //     email,
//     //     username,
//     //     password, // Make sure to hash this in production
//     //     verificationToken,
//     // });
//     // await newUser.save();

//     // Send verification email
//     await sendVerificationEmail(email);
//     return true
// };

// // export const verifyemail = async (email) => {
// //     await connectDB();

// //     // Check if user exists or not
// //     const existingUser = await User.findOne({ email });
// //     if (!existingUser) {
// //         return "User don't exists"
// //         // throw new Error("User already exists");
// //     }
// //     await sendVerificationEmail(email);
// //     return true
// // }

// export const sendVerificationEmail = async (email) => {

//     verificationToken = crypto.randomBytes(3).toString("hex");
//     console.log(verificationToken)

//     const transporter = nodemailer.createTransport({
//         // nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     // const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "Email Verification Code",
//         html: `
//     <div><div className="text-xs">Hi ,</div>
//     <div className="text-xs">Go back to the site and enter this code to confirm your email.</div>
//             <h1>Email Verification Code: ${verificationToken}</h1></div>
//         `,
//     };

//     await transporter.sendMail(mailOptions);

// };
// export const resetPassword = async (email) => {
//     await connectDB();

//     // Check if user exists or not
//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//         return "User don't exists"
//         // throw new Error("User already exists");
//     }
//     await sendotpforforgoting(email);
//     return true
// }

export const sendotpforforgoting = async (email) => {

    verificationToken = crypto.randomBytes(3).toString("hex");
    

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // User's email
        subject: "Password Reset Code",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #4CAF50;">Reset Your Password</h2>
            </div>
            <p>Hi,</p>
            <p>We received a request to reset your password. If this was not you, please ignore this email.</p>
            <p>To reset your password, please use the following code:</p>
            <div style="text-align: center; margin: 20px 0;">
                <h1 style="background: #f9f9f9; padding: 10px 20px; border: 1px solid #ddd; display: inline-block; border-radius: 4px; color: #4CAF50;">
                    ${verificationToken}
                </h1>
            </div>
            <p>If you need further assistance, feel free to contact our support team.</p>
            <br>
            <p>Thanks,</p>
            <p>Your Company Team</p>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);

};

export const sendReviewEmail = async (userEmail, checkout) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const productDetailsList = await fetchProductbyid(checkout);
    let y = JSON.parse(productDetailsList);

    // Map the fetched product details back to checkout items
    const enrichedCheckout = checkout.map(item => {
        const productDetails = y.find(product => product._id === item.product);
        return {
            ...item,
            productName: productDetails?.name || "Unknown Product",
            productImage: productDetails?.image || "https://example.com/default.jpg",
        };
    });

    // Generate HTML for each product
    const productDetailsHTML = enrichedCheckout
        .map(
            (item) => `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; display: flex; align-items: center;">
                    <img 
                        src="${item.productImage}" 
                        alt="${item.productName}" 
                        style="width: 100px; height: 100px; object-fit: cover; margin-right: 15px;"
                    />
                    <div>
                        <h3 style="margin: 0;">Product: ${item.productName}</h3>
                        <p style="margin: 5px 0;">Quantity: ${item.quantity}</p>
                        <a 
                            href="${process.env.NEXT_PUBLIC_URL2}/review?productId=${item.product}" 
                            style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;"
                        >Leave a Review</a>
                    </div>
                </div>
            `
        )
        .join('');

    // Full email HTML
    const emailHTML = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #333;">We value your feedback!</h2>
            <p>Thank you for your purchase. We'd love to hear your thoughts on the products you bought:</p>
            ${productDetailsHTML}
            <p style="margin-top: 20px;">Thank you for shopping with us!</p>
        </div>
    `;

    // Send the email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'We value your feedback!',
        html: emailHTML,
    });



    return 1


};
export const saveReview = async (form)=>{
    await connectDB()
    let a = await Product.findOne({_id: form.productId})
    a.review.push({name:form.namereviewer,message:form.review,star:form.stars,starmess:form.starmess})
    await a.save()

    // let order = a.toObject({ flattenObjectIds: true })
}

export const confirmcode = async (code) => {
    if (code === verificationToken) {
        return true
    }
    return false
}
