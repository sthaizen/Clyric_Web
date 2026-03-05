import React from "react";

const BentoGridItem = ({ title, description, icon, className, ...props }) => {
  return (
    <div
      className={`flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200 transition-transform hover:scale-105 duration-300 ease-in-out ${className}`}
      {...props}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-black">{title}</h3>
      <p className="text-gray-700 text-sm sm:text-base">{description}</p>
    </div>
  );
};

export default BentoGridItem;
