'use client'
import { useEffect } from "react";
import { useRouter } from "next/router";

const ScrollHandler = () => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return; // Prevent running on the server

        const handleRouteChange = () => {
            window.scrollTo(0, 0); // Always scroll to top when a new page is loaded
        };

        router.events.on("routeChangeComplete", handleRouteChange);

        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router]);

    return null;
};

export default ScrollHandler;