"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

const WEEKS_IN_YEAR = 53;
const DAYS_IN_WEEK = 7;
const JANUARY_MONTH = 0;
const DECEMBER_MONTH = 11;
const SUNDAY_DAY = 0;
const MIN_WEEKS_FOR_DECEMBER_HEADER = 2;
const TOOLTIP_OFFSET_X = 10;
const TOOLTIP_OFFSET_Y = 40;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CONTRIBUTION_COLORS = [
  "bg-[#232329]/40",         // Level 0 - Solid dark block
  "bg-indigo-500/30",     // Level 1
  "bg-indigo-500/50",     // Level 2
  "bg-indigo-500/80",     // Level 3
  "bg-indigo-500",        // Level 4
  "bg-indigo-600",        // Level 5 - Max
];

const LEVEL_0 = 0;
const LEVEL_1 = 1;
const LEVEL_2 = 2;
const LEVEL_3 = 3;
const LEVEL_4 = 4;
const LEVEL_5 = 5;
const CONTRIBUTION_LEVELS = [LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];
const DAY_1 = 1;
const DAY_31 = 31;

const isDateInValidRange = (currentDate, startDate, endDate, targetYear) => {
  const isInRange = currentDate >= startDate && currentDate <= endDate;
  const isPreviousYearDecember =
    currentDate.getFullYear() === targetYear - 1 &&
    currentDate.getMonth() === DECEMBER_MONTH;
  const isNextYearJanuary =
    currentDate.getFullYear() === targetYear + 1 &&
    currentDate.getMonth() === JANUARY_MONTH;
  return isInRange || isPreviousYearDecember || isNextYearJanuary;
};

const createDayData = (currentDate, contributionData) => {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  const existingData = contributionData.find((d) => d.date === dateString);
  return {
    date: dateString,
    count: existingData?.count ?? LEVEL_0,
    level: existingData?.level ?? LEVEL_0,
  };
};

const shouldShowMonthHeader = ({
  currentYear,
  targetYear,
  currentMonth,
  startDateDay,
  weekCount,
}) =>
  currentYear === targetYear ||
  (currentYear === targetYear - 1 &&
    currentMonth === DECEMBER_MONTH &&
    startDateDay !== SUNDAY_DAY &&
    weekCount >= MIN_WEEKS_FOR_DECEMBER_HEADER);

const calculateMonthHeaders = (targetYear) => {
  const headers = [];
  const startDate = new Date(targetYear, JANUARY_MONTH, DAY_1);
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());

  let currentMonth = -1;
  let currentYear = -1;
  let monthStartWeek = 0;
  let weekCount = 0;

  for (let weekNumber = 0; weekNumber < WEEKS_IN_YEAR; weekNumber++) {
    const weekDate = new Date(firstSunday);
    weekDate.setDate(firstSunday.getDate() + weekNumber * DAYS_IN_WEEK);

    const monthKey = weekDate.getMonth();
    const yearKey = weekDate.getFullYear();

    if (monthKey !== currentMonth || yearKey !== currentYear) {
      if (
        currentMonth !== -1 &&
        shouldShowMonthHeader({
          currentYear,
          targetYear,
          currentMonth,
          startDateDay: startDate.getDay(),
          weekCount,
        })
      ) {
        headers.push({
          month: MONTHS[currentMonth],
          colspan: weekCount,
          startWeek: monthStartWeek,
        });
      }
      currentMonth = monthKey;
      currentYear = yearKey;
      monthStartWeek = weekNumber;
      weekCount = 1;
    } else {
      weekCount++;
    }
  }

  if (
    currentMonth !== -1 &&
    shouldShowMonthHeader({
      currentYear,
      targetYear,
      currentMonth,
      startDateDay: startDate.getDay(),
      weekCount,
    })
  ) {
    headers.push({
      month: MONTHS[currentMonth],
      colspan: weekCount,
      startWeek: monthStartWeek,
    });
  }

  return headers;
};

export function ContributionGraph({
  data = [],
  year = new Date().getFullYear(),
  className = "",
}) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const yearData = useMemo(() => {
    const startDate = new Date(year, JANUARY_MONTH, DAY_1);
    const endDate = new Date(year, DECEMBER_MONTH, DAY_31);
    const days = [];

    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());

    for (let weekNum = 0; weekNum < WEEKS_IN_YEAR; weekNum++) {
      for (let day = 0; day < DAYS_IN_WEEK; day++) {
        const currentDate = new Date(firstSunday);
        currentDate.setDate(firstSunday.getDate() + weekNum * DAYS_IN_WEEK + day);

        if (isDateInValidRange(currentDate, startDate, endDate, year)) {
          days.push(createDayData(currentDate, data));
        } else {
          days.push({
            date: "",
            count: LEVEL_0,
            level: LEVEL_0,
          });
        }
      }
    }
    return days;
  }, [data, year]);

  const monthHeaders = useMemo(() => calculateMonthHeaders(year), [year]);

  const handleDayHover = (day, event) => {
    if (day.date) {
      setHoveredDay(day);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleDayLeave = () => {
    setHoveredDay(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className={`contribution-graph relative w-full ${className}`}>
      
      {/* CHANGED HERE:
        Replaced the custom scrollbar styles with utility classes to hide it completely across all browsers:
        - [&::-webkit-scrollbar]:hidden (Chrome/Safari/Edge)
        - [-ms-overflow-style:none] (IE 10+)
        - [scrollbar-width:none] (Firefox)
      */}
      <div className="overflow-x-auto overflow-y-hidden pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <table className="border-collapse min-w-max" style={{ borderSpacing: '4px', borderCollapse: 'separate' }}>
          <caption className="sr-only">Contribution Graph for {year}</caption>

          {/* Month Headers */}
          <thead>
            <tr>
              <td className="w-[30px]" />
              {monthHeaders.map((header) => (
                <td
                  className="text-left pb-2"
                  colSpan={header.colspan}
                  key={`${header.month}-${header.startWeek}`}
                >
                  <span className="text-[13px] font-medium text-gray-400">{header.month}</span>
                </td>
              ))}
            </tr>
          </thead>

          {/* Day Grid */}
          <tbody>
            {Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) => (
              <tr key={DAYS[dayIndex]}>
                {/* Day Labels */}
                <td className="w-[30px] pr-3 text-right relative">
                  {[1, 3, 5].includes(dayIndex) && (
                    <span className="text-[12px] font-medium text-gray-500 absolute top-1/2 -translate-y-1/2 right-2">
                      {DAYS[dayIndex]}
                    </span>
                  )}
                </td>

                {/* Day Cells */}
                {Array.from({ length: WEEKS_IN_YEAR }, (_, w) => {
                  const dayData = yearData[w * DAYS_IN_WEEK + dayIndex];
                  const cellKey = `${dayData?.date ?? "empty"}-${w}-${dayIndex}`;
                  
                  if (!dayData?.date) {
                    return (
                      <td className="p-0" key={cellKey}>
                        <div className="w-[14px] h-[14px]" />
                      </td>
                    );
                  }

                  return (
                    <td
                      className="p-0"
                      key={cellKey}
                      onMouseEnter={(e) => handleDayHover(dayData, e)}
                      onMouseLeave={handleDayLeave}
                    >
                      <div
                        className={`w-[14px] h-[14px] rounded-[4px] transition-all duration-200 ${CONTRIBUTION_COLORS[dayData.level]} hover:ring-[2px] hover:ring-indigo-400/60 z-10 cursor-pointer`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend & Help Link Area */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[13px] text-gray-500 px-1">
        <a href="#" className="hover:text-white transition-colors mb-2 sm:mb-0">
          Learn how we count activites
        </a>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-[4px]">
            {CONTRIBUTION_LEVELS.map((level) => (
              <div
                className={`w-[14px] h-[14px] rounded-[4px] ${CONTRIBUTION_COLORS[level]}`}
                key={level}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-[#16161a] px-3.5 py-2.5 text-sm shadow-xl flex gap-2 items-center"
          exit={shouldReduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.95, y: 4 }}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 4 }}
          style={{
            left: tooltipPosition.x + TOOLTIP_OFFSET_X,
            top: tooltipPosition.y - TOOLTIP_OFFSET_Y,
          }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
        >
          <span className="font-semibold text-white">
            {hoveredDay.count === 0 ? "No" : hoveredDay.count} contributions
          </span>
          <span className="text-gray-400 text-[13px]">on {formatDate(hoveredDay.date)}</span>
        </motion.div>
      )}
    </div>
  );
}

export default ContributionGraph;