import toast from "react-hot-toast";

/**
 * showUpgradeToast
 * Displays a custom light-themed toast notification for subscription-gated features.
 * Matches the requested UI: White background, dark text, red icon, and elevation.
 */
export const showUpgradeToast = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-center',
    style: {
      background: '#ffffff',
      color: '#111827', // Gray-900 for high legibility
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      minWidth: '350px',
      fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
    },
    iconTheme: {
      primary: '#ef4444', // Red-500 matching the screenshot "X" circle
      secondary: '#fff',
    },
  });
};
