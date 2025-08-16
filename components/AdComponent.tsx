import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const AdComponent: React.FC = () => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // We use a timeout to ensure the ad container is rendered and has dimensions
        // before the AdSense script is called. This is a common fix for `availableWidth=0`
        // errors in single-page applications where components render dynamically.
        const timer = setTimeout(() => {
            // A simple visibility check. If offsetParent is null, the element is not visible.
            if (adContainerRef.current && adContainerRef.current.offsetParent !== null) {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error("AdSense error:", e);
                }
            }
        }, 150); // A small delay is usually sufficient

        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={adContainerRef} className="flex justify-center items-center w-full min-h-[100px] bg-black/20 rounded-lg overflow-hidden">
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client="ca-pub-9361751730861694"
                data-ad-slot="1234567890" // Using a valid numeric format for placeholder slot ID
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdComponent;