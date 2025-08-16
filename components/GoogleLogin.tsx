import React, { useEffect, useRef } from 'react';
import { useMentorX } from '../hooks/useNexusAI';

declare const google: any;

const GOOGLE_CLIENT_ID = "907382893017-o80lb57ndi2d18n6nfli6i1kfkea8drl.apps.googleusercontent.com";

const GoogleLogin: React.FC<{ variant?: 'sidebar' | 'welcome' }> = ({ variant = 'sidebar' }) => {
    const { login } = useMentorX();
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
            console.error("Google Identity Services script not loaded.");
            return;
        }

        const handleCredentialResponse = (response: any) => {
            if(response.credential) {
                login(response.credential);
            }
        };

        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });

        if (buttonRef.current) {
            google.accounts.id.renderButton(
                buttonRef.current,
                { 
                    theme: "outline", 
                    size: "large", 
                    type: "standard", 
                    text: "signin_with", 
                    width: variant === 'sidebar' ? "240" : "280"
                }
            );
        }

        return () => {
            // Optional: Cleanup if the component unmounts, though GSI handles much of this.
        }

    }, [login, variant]);

    return <div ref={buttonRef} className="flex justify-center"></div>;
};

export default GoogleLogin;
