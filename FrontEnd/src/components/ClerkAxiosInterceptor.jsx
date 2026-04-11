import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthToken } from '../lib/axios';

/**
 * This component acts as a bridge between Clerk's Auth context 
 * and our static Axios instance. It keeps the global Axios 
 * token in sync whenever the user's session changes.
 */
export const ClerkAxiosInterceptor = ({ children }) => {
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        const syncToken = async () => {
            if (isSignedIn) {
                try {
                    const token = await getToken();
                    setAuthToken(token);
                } catch (error) {
                    console.error("Failed to sync Clerk token with Axios:", error);
                    setAuthToken(null);
                }
            } else {
                setAuthToken(null);
            }
        };

        syncToken();
        
        // Refresh token every 50 seconds (Clerk tokens usually last 60s)
        const interval = setInterval(syncToken, 50000);
        return () => clearInterval(interval);
    }, [getToken, isSignedIn]);

    return children;
};

export default ClerkAxiosInterceptor;
