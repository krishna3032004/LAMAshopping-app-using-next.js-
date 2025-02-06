"use client"; // For Next.js App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use "next/router" for Pages Router

const ScrollHandler = () => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure it only runs in the browser

        const handleRouteChange = () => {
            window.scrollTo(0, 0); // Scroll to top when navigating
        };

        router.events?.on("routeChangeComplete", handleRouteChange);

        return () => {
            router.events?.off("routeChangeComplete", handleRouteChange);
        };
    }, [router]);

    return null;
};

export default ScrollHandler;
