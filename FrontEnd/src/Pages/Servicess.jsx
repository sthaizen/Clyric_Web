import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import CAT from "../components/CAT";
import Footer from "../components/Footer";
import assets from "../assets/assets";

const Servicess = () => {
  const [activeTab, setActiveTab] = useState("All");
  
  const tabs = ["All", "Marketing Tips", "Business Strategies", "Industry Insights", "Client Success"];
  
const articles = [
  {
    id: 1,
    tag: "Hosting",
    title: "Taudaha Hosting Plan – 3 GB Storage",
    description: "Ideal for personal websites and small projects. Includes 3 GB storage with a total cost of NPR 1,379.73 (VAT included).",
    image: assets.call,
  },
  {
    id: 2,
    tag: "Hosting",
    title: "Gosaikunda Hosting Plan – 7 GB Storage",
    description: "Perfect for growing websites. Enjoy 7 GB storage with a total price of NPR 2,001.23 including 13% VAT.",
    image: assets.gosai,
  },
  {
    id: 3,
    tag: "Hosting",
    title: "Phoskundo Hosting Plan – 15 GB Storage",
    description: "Designed for medium-scale websites. Comes with 15 GB storage at a total cost of NPR 2,352.66 (VAT included).",
    image: assets.bharav,
  },
  {
    id: 4,
    tag: "Hosting",
    title: "Gokyo Hosting Plan – 40 GB Storage",
    description: "A powerful solution for business websites. Get 40 GB storage with a total payable amount of NPR 3,012.58.",
    image: assets.tunda,
  },
  {
    id: 5,
    tag: "Hosting",
    title: "Tilicho Hosting Plan – 80 GB Storage",
    description: "Built for high-traffic platforms. Offers 80 GB storage at a total price of NPR 3,994.55 including VAT.",
    image: assets.bag,
  },
  {
    id: 6,
    tag: "Hosting",
    title: "RARA Hosting Plan – 777 GB Storage",
    description: "Enterprise-grade hosting for large-scale applications. Includes 777 GB storage with a total cost of NPR 7,532.58.",
    image: assets.path,
  }
];


  return (
    <div className="min-h-screen bg-white ">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <h1 className="text-3xl lg:text-7xl font-bold mb-8 dm-sans2">Packages & Services</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-20 ">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                activeTab === tab
                  ? "bg-[#1f427e] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Featured Article */}
      <div className="mb-16">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-0 bg-[#ffffff] overflow-hidden min-h-[620px]">
          
          {/* Image Section */}
          <div className="relative">
            <img
              src="https://www.hostinger.com/cdn-cgi/imagedelivery/LqiWLm-3MGbYHtFuUbcBtA/319eb681-6c66-4419-c6a5-17f68d3a9500/w=1760,sharpen=1"
              alt="Featured"
              className="absolute inset-0 w-full h-full object-cover rounded-3xl "
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit">
              News
            </span>

            <h2 className="text-2xl lg:text-5xl font-bold mb-10">
              Maximizing Efficiency in Operations
            </h2>

            <p className="text-gray-600 mb-16 leading-relaxed">
              We offer a comprehensive range of services tailored to meet the unique needs of your business. From strategy development to risk management, our expert team is dedicated to driving your success.
            </p>

            <button className="dm-sans2 w-[460px]  md:w-full h-[49px]  bg-white border-2 border-gray-900 rounded-full text-[18px] font-semibold text-gray-900 hover:bg-[#1f427e] hover:border-[#1f427e] hover:text-white transition-all duration-300 dm-sans2 cursor-pointer">
              Read more
            </button>
          </div>

        </div>
      </div>


        {/* Latest Insights Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
            <span className="text-sm text-gray-600">Blog and articles</span>
          </div>
          <h2 className="text-2xl lg:text-7xl font-bold mb-20 dm-sans2">Latest insights</h2>
        </div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-134 object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3 dm-sans2">
                {article.tag}
              </span>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors dm-sans2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed dm-sans3">
                {article.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <CAT />
      <Footer />
    </div>
  );
};

export default Servicess;