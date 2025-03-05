"use client"; // ✅ Add this at the top

import { useState, useEffect } from "react";

const MyComponent = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Ensures this runs only on the client
    }, []);

    if (!mounted) return null; // Prevent mismatch during hydration

    return <div>Client Component Loaded</div>;
};

export default MyComponent;
