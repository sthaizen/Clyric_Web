import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#d4d4d8"];
const DIFF_COLORS = {
  Easy: "#10b981",    // Emerald
  Medium: "#f59e0b",  // Amber
  Hard: "#ef4444",    // Rose
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 p-4 rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-xs min-w-[120px]">
        <p className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px]">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color === '#d1d5db' ? '#374151' : entry.color }} className="font-bold text-[13px] flex items-center justify-between gap-4">
            <span className="opacity-80 drop-shadow-sm text-gray-700">{entry.name}</span> <span className="text-[#18181b]">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const fadeUp = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function AdminCharts({ trends }) {
  if (!trends) return null;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
      
      {/* 1. Signup Trend (Line Chart) */}
      <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-[28px] p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <h4 className="text-[15px] text-[#18181B] font-bold mb-6 flex items-center gap-2 relative z-10">User Registration Trend</h4>
        <div className="h-[260px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends.signups}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis 
                dataKey="_id" 
                stroke="#9ca3af" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => val.split('-').slice(1).join('/')}
                dy={10}
              />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Signups"
                stroke="#18181B"
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#18181B", stroke: "rgba(24, 24, 27, 0.2)", strokeWidth: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2. Submission Activity (Area Chart) */}
      <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-[28px] p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <h4 className="text-[15px] text-[#18181B] font-bold mb-6 flex items-center gap-2 relative z-10">Submission Performance</h4>
        <div className="h-[260px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends.submissions}>
              <defs>
                <linearGradient id="colorTotalLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e5e7eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f3f4f6" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorAcceptedLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#18181B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis 
                dataKey="_id" 
                stroke="#9ca3af" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => val.split('-').slice(1).join('/')}
                dy={10}
              />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.05)', fill: 'rgba(0,0,0,0.02)' }} />
              <Area
                type="monotone"
                dataKey="total"
                name="Total Submissions"
                stroke="#d1d5db"
                fillOpacity={1}
                fill="url(#colorTotalLight)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="accepted"
                name="Accepted"
                stroke="#18181B"
                fillOpacity={1}
                fill="url(#colorAcceptedLight)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 3. Problem Difficulty (Donut Chart) */}
      <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-[28px] p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <h4 className="text-[15px] text-[#18181B] font-bold mb-6 relative z-10">Difficulty Distribution</h4>
        <div className="h-[260px] w-full flex items-center justify-center relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trends.difficulties}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                stroke="none"
              >
                {trends.difficulties.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DIFF_COLORS[entry._id] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 4. Language Usage (Bar Chart) */}
      <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-[28px] p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <h4 className="text-[15px] text-[#18181B] font-bold mb-6 flex items-center gap-2 relative z-10">Language Popularity</h4>
        <div className="h-[260px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends.languages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis dataKey="_id" type="category" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} width={80} fontWeight="bold" textTransform="uppercase" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="count" name="Submissions" radius={[0, 6, 6, 0]} barSize={20}>
                {trends.languages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}
