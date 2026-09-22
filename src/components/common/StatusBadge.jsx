import React from 'react';

export const StatusBadge = ({ status, customLabel }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  let badgeClass = 'badge-neutral';

  switch (normalized) {
    case 'approved':
    case 'active':
    case 'success':
    case 'completed':
    case 'paid':
      badgeClass = 'badge-success';
      break;
    case 'pending':
    case 'under review':
    case 'maturing soon':
    case 'warning':
    case 'partial':
      badgeClass = 'badge-warning';
      break;
    case 'rejected':
    case 'failed':
    case 'frozen':
    case 'overdue':
    case 'closed':
    case 'inactive':
    case 'danger':
      badgeClass = 'badge-danger';
      break;
    case 'processing':
    case 'review':
    case 'info':
      badgeClass = 'badge-info';
      break;
    case 'matured':
      badgeClass = 'badge-purple';
      break;
    default:
      badgeClass = 'badge-neutral';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot"></span>
      {customLabel || status}
    </span>
  );
};
