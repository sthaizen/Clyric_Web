import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-[#0b0b0b] text-white">
      <div className="flex flex-col items-center gap-4">
        {/* Simple futuristic spinner */}
        <div className="w-12 h-12 border-4 border-t-[#fba120] border-r-transparent border-b-[#8a6bfe] border-l-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium tracking-widest text-gray-400">LOADING...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
