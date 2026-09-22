import React from 'react';

export const SkeletonCard = ({ count = 4 }) => {
  return (
    <div className="stat-card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card" style={{ minHeight: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div className="skeleton" style={{ width: '60%', height: '14px' }}></div>
            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px' }}></div>
          </div>
          <div className="skeleton" style={{ width: '45%', height: '28px', marginBottom: '12px' }}></div>
          <div className="skeleton" style={{ width: '70%', height: '12px' }}></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header">
        <div className="skeleton" style={{ width: '200px', height: '20px' }}></div>
        <div className="skeleton" style={{ width: '120px', height: '32px' }}></div>
      </div>
      <div style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="skeleton" style={{ flex: 1, height: '16px' }}></div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: 'flex', gap: '16px', padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="skeleton" style={{ flex: 1, height: '14px' }}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
