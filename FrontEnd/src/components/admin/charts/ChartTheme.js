export const ChartTheme = {
  colors: {
    primary: "#18181B",      // Slate 900
    secondary: "#4b5563",    // Slate 600
    tertiary: "#9ca3af",     // Slate 400
    accent: "#4f46e5",       // Indigo 600 (from area chart)
    background: "#ffffff",
    border: "#f3f4f6",       // Gray 100 / Slate 200 light
    grid: "rgba(0,0,0,0.03)",
    text: "#9ca3af",
    tooltipText: "#18181B"
  },
  axis: {
    tick: { fontSize: 10, fill: "#9ca3af", fontWeight: 700 },
    axisLine: false,
    tickLine: false,
    dy: 10,
    dx: -10
  },
  tooltip: {
    cursor: { fill: "rgba(0,0,0,0.03)" },
    contentStyle: { 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      border: '1px solid #f3f4f6', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
      fontSize: '11px', 
      fontWeight: 'bold', 
      color: '#18181B',
      padding: '8px 12px'
    },
    itemStyle: {
      color: '#18181B',
      fontWeight: 'bold'
    }
  },
  grid: {
    stroke: "rgba(0,0,0,0.03)",
    strokeDasharray: "4 4",
    vertical: false
  }
};
