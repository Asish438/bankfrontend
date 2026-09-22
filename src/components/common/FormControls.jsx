import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  style = {}
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={style}
    >
      {isLoading ? (
        <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
};

export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  hint,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <Icon
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          style={{ paddingLeft: Icon ? '36px' : '14px' }}
          {...props}
        />
      </div>
      {error && <span className="form-error-msg">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  hint,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const labelText = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error && <span className="form-error-msg">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export const Tabs = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className="tab-nav">
      {tabs.map((tab) => {
        const id = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const icon = typeof tab === 'object' ? tab.icon : null;
        const badge = typeof tab === 'object' ? tab.badge : null;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(id)}
            type="button"
          >
            {icon}
            <span>{label}</span>
            {badge !== undefined && badge !== null && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'var(--primary-100)' : 'var(--bg-surface-muted)',
                  color: isActive ? 'var(--primary-700)' : 'var(--text-muted)',
                  fontWeight: 600
                }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
