'use client'
import { useEffect } from "react";
import { useRouter } from "next/router";

const ScrollHandler = () => {
    const router = useRouter();

    useEffect(() => {
        let scrollPositions = {};

        const saveScrollPosition = (url) => {
            scrollPositions[url] = window.scrollY; // Save scroll position before navigation
        };

        const restoreScrollPosition = (url) => {
            if (scrollPositions[url] !== undefined) {
                window.scrollTo(0, scrollPositions[url]); // Restore scroll position
            } else {
                window.scrollTo(0, 0); // Default to top if no saved position
            }
        };

        router.events.on("routeChangeStart", saveScrollPosition);
        router.events.on("routeChangeComplete", restoreScrollPosition);

        return () => {
            router.events.off("routeChangeStart", saveScrollPosition);
            router.events.off("routeChangeComplete", restoreScrollPosition);
        };
    }, [router]);

    return null;
};

export default ScrollHandler;