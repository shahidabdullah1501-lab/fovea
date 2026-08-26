import React from 'react';

interface Point {
  value: number;
}

interface LineChartProps {
  points: Point[];
  color?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ points, color = '#C68A3D', height = 110 }) => {
  if (!points || points.length < 2) {
    return (
      <div className="py-3.5 text-text-faint text-xs">
        Not enough sessions logged yet to plot a progress trend.
      </div>
    );
  }

  const w = 300;
  const vals = points.map(p => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const stepX = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - ((p.value - min) / range) * (height - 16) - 8;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const x = i * stepX;
        const y = height - ((p.value - min) / range) * (height - 16) - 8;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
};
