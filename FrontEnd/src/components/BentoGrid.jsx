import React from "react";

const BentoGrid = ({ children, className, ...props }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default BentoGrid;
