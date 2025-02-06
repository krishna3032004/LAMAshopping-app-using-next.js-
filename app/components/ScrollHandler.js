"use client"; // Ensure it only runs on the client side

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Works for both App Router and Pages Router

const ScrollHandler = () => {
    const pathname = usePathname();
    console.log(pathname) // Get the current page route

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0); // Force scroll to top when the route changes
            console.log("scroll to top")
        }
    }, [pathname]); // Runs whenever the route changes

    return null;
};

export default ScrollHandler;