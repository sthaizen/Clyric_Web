import React, { useRef, useState, useEffect } from 'react';

/**
 * SafeChartFrame ensures that Recharts ResponsiveContainer receives valid bounding
 * dimensions BEFORE plotting SVGs, avoiding zero-height or zero-width crashes 
 * commonly associated with complex dashboard resizing and grid layouts.
 */
export default function SafeChartFrame({ 
  children, 
  title, 
  icon: Icon,
  action,
  customHeader,
  className = "",
  minHeight = "200px" 
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    let rafId;
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Only set state if significantly changed to avoid thrashing
      setDimensions(prev => {
        if (Math.abs(prev.width - width) > 1 || Math.abs(prev.height - height) > 1) {
          return { width, height };
        }
        return prev;
      });
    };

    const observer = new ResizeObserver(() => {
      // Defer state update to next frame to avoid React flushSync warnings
      rafId = requestAnimationFrame(updateDimensions);
    });

    observer.observe(containerRef.current);
    updateDimensions(); // Initial layout pass

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const isReady = dimensions.width > 0 && dimensions.height > 0;

  return (
    <div className={`bg-white rounded-[28px] border border-gray-100 p-6 flex flex-col relative shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${className}`}>
      
      {/* Optional standardized header row */}
      {customHeader ? customHeader : (title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
               <div className="w-7 h-7 bg-gray-50 rounded-[8px] flex items-center justify-center border border-gray-200">
                  <Icon strokeWidth={2.5} className="w-3.5 h-3.5 text-gray-700" />
               </div>
            )}
            {title && (
               <span className="font-bold text-[13px] uppercase tracking-widest text-gray-400">
                 {title}
               </span>
            )}
          </div>
          {action && action}
        </div>
      )}

      {/* Internal measuring frame forcing a robust flex stretch */}
      <div 
        ref={containerRef} 
        className="flex-1 w-full min-h-0 relative" 
        style={{ minHeight }}
      >
        {isReady ? (
          <div className="absolute inset-0 top-0 left-0">
             {children}
          </div>
        ) : (
          <div className="absolute inset-0 top-0 left-0 bg-gray-50/50 rounded-xl animate-pulse flex items-center justify-center border border-gray-100 border-dashed">
            <span className="text-[11px] font-bold text-gray-400">Loading metrics...</span>
          </div>
        )}
      </div>
    </div>
  );
}
