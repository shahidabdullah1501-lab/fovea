import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="card p-4">
      <div className="stat-box">
        <div className="stat-num">{value}</div>
        <div className="stat-lbl">{label}</div>
      </div>
    </div>
  );
};
