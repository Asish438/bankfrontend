import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  trendText = 'from last month',
  iconColor = 'var(--primary-600)',
  iconBg = 'var(--primary-50)',
  onClick
}) => {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-top">
        <span className="stat-card-label">{title}</span>
        <div
          className="stat-card-icon-wrap"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-bottom">
        {trend && (
          <span className={`trend-badge trend-${trendType}`}>
            {trendType === 'positive' && <ArrowUpRight size={14} />}
            {trendType === 'negative' && <ArrowDownRight size={14} />}
            {trendType === 'neutral' && <Minus size={14} />}
            {trend}
          </span>
        )}
        {trendText && <span className="trend-text">{trendText}</span>}
      </div>
    </div>
  );
};
