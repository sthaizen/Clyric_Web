import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import PaymentStatusModal from './PaymentStatusModal';

/**
 * Global component that listens for payment-related query parameters in the URL.
 * Displays a premium Modal for success/error results and handles Khalti pidx verification.
 */
export default function PaymentListener() {
    const [searchParams] = useSearchParams();
    const isProcessing = useRef(false);
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'success', // 'success' or 'error'
        message: '',
        gateway: ''
    });

    useEffect(() => {
        const paymentStatus = searchParams.get('payment_status');
        const gateway = searchParams.get('gateway');
        const pidx = searchParams.get('pidx');
        const reason = searchParams.get('reason');

        // Check if we have any payment parameters to process
        if ((paymentStatus || pidx) && !isProcessing.current) {
            isProcessing.current = true;
            handlePayment(paymentStatus, gateway, pidx, reason);
        }
    }, [searchParams]);

    const handlePayment = async (status, gateway, pidx, reason) => {
        try {
            // Case 1: Khalti Verification needed (Success redirect from Khalti providing pidx)
            if (gateway === 'khalti' && pidx) {
                const toastId = toast.loading('Verifying Khalti payment...');
                
                try {
                    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                    const endpoint = baseUrl.endsWith('/api')
                        ? `${baseUrl}/payments/verify/khalti`
                        : `${baseUrl}/api/payments/verify/khalti`;

                    const res = await axios.post(
                        endpoint,
                        { pidx },
                        { withCredentials: true }
                    );

                    if (res.data.success) {
                        toast.success('Payment Verified!', { id: toastId });
                        setModalConfig({
                            isOpen: true,
                            type: 'success',
                            gateway: 'Khalti',
                            message: 'Your Khalti payment has been verified. Subscription activated!'
                        });
                    } else {
                        toast.error('Verification failed.', { id: toastId });
                        setModalConfig({
                            isOpen: true,
                            type: 'error',
                            gateway: 'Khalti',
                            message: res.data.message || 'Khalti could not verify your payment at this time.'
                        });
                    }
                } catch (err) {
                    console.error('Verification error:', err);
                    toast.error('Server verification failed.', { id: toastId });
                    setModalConfig({
                        isOpen: true,
                        type: 'error',
                        gateway: 'Khalti',
                        message: 'Error connecting to verification server. Please contact support.'
                    });
                }
            } 
            // Case 2: eSewa or other explicit status success
            else if (status === 'success') {
                setModalConfig({
                    isOpen: true,
                    type: 'success',
                    gateway: gateway || 'eSewa',
                    message: `Your payment via ${gateway || 'eSewa'} was successful. Pro features are now active!`
                });
            } 
            // Case 3: Error reported by backend/gateway
            else if (status === 'error') {
                const errorMsg = reason ? reason.replace(/_/g, ' ') : 'The transaction was unsuccessful or cancelled.';
                setModalConfig({
                    isOpen: true,
                    type: 'error',
                    gateway: gateway || 'Gateway',
                    message: errorMsg
                });
            }

            // Cleanup URL: Remove payment-related params without refreshing
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            
            // Note: We don't reset isProcessing to false here because we only want one modal per URL load.
            // It will reset on next full render cycle if params are gone.

        } catch (error) {
            console.error('PaymentListener Error:', error);
            isProcessing.current = false;
        }
    };

    const closeHandler = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        isProcessing.current = false;
    };

    return (
        <PaymentStatusModal 
            isOpen={modalConfig.isOpen}
            onClose={closeHandler}
            type={modalConfig.type}
            message={modalConfig.message}
            gateway={modalConfig.gateway}
        />
    );
}
