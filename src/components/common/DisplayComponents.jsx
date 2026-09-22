import React from 'react';
import { FolderOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAvatarColor, getInitials } from '../../services/formatters';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No Records Found",
  description = "There are currently no items matching your criteria or no data available.",
  actionText,
  onAction,
  actionIcon: ActionIcon,
  actionLink
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLink ? (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          {ActionIcon && <ActionIcon size={16} />}
          {actionText}
        </Link>
      ) : actionText && onAction ? (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {ActionIcon && <ActionIcon size={16} />}
          {actionText}
        </button>
      ) : null}
    </div>
  );
};

export const LoadingState = ({ message = "Loading banking records..." }) => {
  return (
    <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <Loader2 size={36} color="var(--primary-600)" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export const ChartCard = ({
  title,
  subtitle,
  children,
  action,
  headerStyle = {},
  style = {}
}) => {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', ...style }}>
      <div className="card-header" style={headerStyle}>
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="card-body" style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export const UserAvatar = ({
  name = '',
  avatarUrl,
  size = 36,
  showBorder = true,
  className = ''
}) => {
  const [imgError, setImgError] = React.useState(false);

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`user-avatar ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: showBorder ? '2px' : '0'
        }}
      />
    );
  }

  const bgColor = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`user-avatar-fallback ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
        fontSize: size > 40 ? '1rem' : '0.8rem'
      }}
    >
      {initials}
    </div>
  );
};

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span style={{ color: 'var(--border-strong)' }}>/</span>}
            {isLast || !item.link ? (
              <span className="breadcrumb-active">{item.label}</span>
            ) : (
              <Link to={item.link} className="breadcrumb-item">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
