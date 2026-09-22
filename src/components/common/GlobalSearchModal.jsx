import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, CreditCard, FileText, ArrowRight, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { formatINR } from '../../services/formatters';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ members: [], accounts: [], loans: [], transactions: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ members: [], accounts: [], loans: [], transactions: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await api.globalSearch(query);
          setResults(res);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults({ members: [], accounts: [], loans: [], transactions: [] });
      }
    }, 200);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  const hasAnyResults =
    results.members.length > 0 ||
    results.accounts.length > 0 ||
    results.loans.length > 0 ||
    results.transactions.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '80px' }}>
      <div
        className="modal-container modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}
      >
        {/* Search Bar Input in Modal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '12px'
          }}
        >
          <Search size={22} color="var(--primary-600)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search members, accounts, loans, transaction IDs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              background: 'transparent',
              outline: 'none'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          )}
          <span className="search-shortcut-badge">ESC</span>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Searching banking records...
            </div>
          ) : query.trim().length >= 2 && !hasAnyResults ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No results found for "<span style={{ color: 'var(--text-primary)' }}>{query}</span>".
            </div>
          ) : query.trim().length < 2 ? (
            <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Quick Search Tips:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Member ID (e.g. <code>M1001</code>) or Member Name</li>
                <li>Savings Account (e.g. <code>SB100201</code>)</li>
                <li>Loan ID (e.g. <code>LN10021</code>)</li>
                <li>Transaction Reference (e.g. <code>TXN90281</code>)</li>
              </ul>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Members Group */}
              {results.members.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} />
                    <span>Members ({results.members.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.members.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelect(`/members/${m.id}`)}
                        className="search-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          cursor: 'pointer',
                          transition: 'background-color var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: '0.85rem' }}>{m.id}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{m.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mobile: {m.mobile} • {m.branch}</div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accounts Group */}
              {results.accounts.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} />
                    <span>Savings Accounts ({results.accounts.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.accounts.map((acc) => (
                      <div
                        key={acc.accountNumber}
                        onClick={() => handleSelect(`/savings/${acc.accountNumber}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--status-success-text)', fontSize: '0.85rem' }}>{acc.accountNumber}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{acc.memberName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Balance: {formatINR(acc.balance)} • {acc.status}</div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loans Group */}
              {results.loans.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wallet size={14} />
                    <span>Loans ({results.loans.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.loans.map((l) => (
                      <div
                        key={l.loanId}
                        onClick={() => handleSelect(`/loans/${l.loanId}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: '0.85rem' }}>{l.loanId}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{l.memberName} ({l.loanType})</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Amount: {formatINR(l.requestedAmount)} • {l.status}</div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions Group */}
              {results.transactions.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} />
                    <span>Transactions ({results.transactions.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.transactions.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleSelect(`/accounting`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{t.id}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.type} - {formatINR(t.amount)}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.memberName} • {t.paymentMode} ({t.date})</div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
