"use client"; // Ensure it only runs on the client side

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Works for both App Router and Pages Router

const ScrollHandler = () => {
    const pathname = usePathname();
    console.log(pathname) // Get the current page route

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTimeout(() => {
                window.scrollTo(0, 0);
                console.log("scroll to top")
            }, 10); // Small delay to ensure scroll resets
        }
    }, [pathname]); // Runs whenever the route changes

    return null;
};

export default ScrollHandler;