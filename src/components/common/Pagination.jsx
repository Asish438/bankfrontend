import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const startIdx = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.84rem',
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: '12px'
      }}
    >
      <div>
        Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{startIdx}</span> to{' '}
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{endIdx}</span> of{' '}
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalItems}</span> entries
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ padding: '6px 10px' }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((page, idx, arr) => (
            <React.Fragment key={page}>
              {idx > 0 && page - arr[idx - 1] > 1 && (
                <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>...</span>
              )}
              <button
                className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onPageChange(page)}
                style={{ minWidth: '32px', padding: '6px 8px' }}
              >
                {page}
              </button>
            </React.Fragment>
          ))}

        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ padding: '6px 10px' }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
