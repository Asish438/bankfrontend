/**
 * Formatting and Helper Utilities for BankAdmin Portal
 */

// Format numbers into Indian Rupee Currency string (e.g. ₹4,85,230 or ₹1,00,000)
export const formatINR = (amount, showDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  const num = Number(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);

  return formatted;
};

// Format standard number with Indian Comma Separation
export const formatIndianNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(Number(num));
};

// Format Date string to readable format (e.g., '22 Sep 2026' or '22 Sep 2026, 11:30 AM')
export const formatDate = (dateInput, includeTime = false) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }

  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

// Format phone number with standard +91 prefix
export const formatMobile = (phone) => {
  if (!phone) return '-';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Generate realistic mock avatar URL or color
export const getAvatarColor = (name = '') => {
  const colors = [
    '#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#4f46e5', '#db2777'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const getInitials = (name = '') => {
  if (!name) return 'BA';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};
