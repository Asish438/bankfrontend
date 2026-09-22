import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  Landmark,
  Wallet,
  Receipt,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate, formatMobile } from '../services/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { Tabs } from '../components/common/FormControls';
import { Table } from '../components/common/Table';
import { LoadingState } from '../components/common/DisplayComponents';
import { Breadcrumb } from '../components/common/DisplayComponents';
import { KYCReviewModal } from '../components/modals/KYCModals';
import { useNotifications } from '../context/NotificationContext';

export const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const fetchMember = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMemberById(id);
      setMember(res);
    } catch (err) {
      console.error(err);
      showToast("Member profile not found.", "error");
      navigate('/members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  if (isLoading || !member) {
    return <LoadingState message="Loading member 360 profile..." />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'kyc', label: 'KYC Documents', icon: <ShieldCheck size={16} />, badge: member.kycStatus },
    { id: 'savings', label: 'Savings', icon: <CreditCard size={16} />, badge: member.savings?.length || 0 },
    { id: 'rd', label: 'RD Accounts', icon: <PiggyBank size={16} />, badge: member.rds?.length || 0 },
    { id: 'fd', label: 'FD Accounts', icon: <Landmark size={16} />, badge: member.fds?.length || 0 },
    { id: 'loans', label: 'Loans', icon: <Wallet size={16} />, badge: member.loans?.length || 0 },
    { id: 'transactions', label: 'Transactions', icon: <Receipt size={16} />, badge: member.transactions?.length || 0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Breadcrumb Navigation */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Members', link: '/members' },
            { label: `${member.name} (${member.id})` }
          ]}
        />
        <div style={{ marginTop: '8px' }}>
          <Link to="/members" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>Back to Members</span>
          </Link>
        </div>
      </div>

      {/* Member Header Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={member.documents?.photo || member.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={member.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                border: '3px solid var(--primary-500)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.4rem', margin: 0 }}>{member.name}</h1>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-600)', backgroundColor: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                  {member.id}
                </span>
                <StatusBadge status={member.accountStatus} />
                <StatusBadge status={member.kycStatus} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={14} />
                  <span>{formatMobile(member.mobile)}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={14} />
                  <span>{member.email}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Building size={14} />
                  <span>{member.branch}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} />
                  <span>Joined {formatDate(member.joiningDate)}</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsKycModalOpen(true)}
            >
              <ShieldCheck size={16} />
              <span>Review KYC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Personal & Contact Information</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date of Birth</span>
                <span style={{ fontWeight: 600 }}>{formatDate(member.dob)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gender</span>
                <span style={{ fontWeight: 600 }}>{member.gender}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Occupation</span>
                <span style={{ fontWeight: 600 }}>{member.occupation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>PAN Number</span>
                <span style={{ fontWeight: 600 }}>{member.documents?.panCard || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Address & Nominee Details</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Address</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{member.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>City / State / PIN</span>
                <span style={{ fontWeight: 600 }}>{member.city}, {member.state} - {member.pincode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Nominee Name</span>
                <span style={{ fontWeight: 600 }}>{member.nomineeName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Relationship</span>
                <span style={{ fontWeight: 600 }}>{member.nomineeRelationship}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: KYC Documents */}
      {activeTab === 'kyc' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">KYC Verification Files</h3>
              <p className="card-subtitle">Submitted verification documents and compliance audit trails</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsKycModalOpen(true)}>
                <RefreshCw size={14} />
                <span>Re-verify</span>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>Identity Proof</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {member.documents?.idProof || "Aadhaar Card"}
                </div>
                <StatusBadge status={member.kycStatus} />
              </div>

              <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>Address Proof</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {member.documents?.addressProof || "Utility Bill"}
                </div>
                <StatusBadge status={member.kycStatus} />
              </div>

              <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>Compliance Officer</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {member.kycReviewedBy || "Pending Review"}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Submitted: {member.kycSubmittedDate || member.joiningDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Savings */}
      {activeTab === 'savings' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Savings Accounts</h3>
            <Link to="/savings" className="btn btn-secondary btn-sm">All Accounts</Link>
          </div>
          <div className="card-body">
            {(!member.savings || member.savings.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No savings account opened for this member.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {member.savings.map((s) => (
                  <div key={s.accountNumber} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{s.accountNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Opened: {formatDate(s.openingDate)} • {s.branch}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--status-success-text)' }}>{formatINR(s.balance)}</div>
                      <StatusBadge status={s.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: RD Accounts */}
      {activeTab === 'rd' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recurring Deposit (RD) Accounts</h3>
          </div>
          <div className="card-body">
            {(!member.rds || member.rds.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No RD accounts linked to this member.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {member.rds.map((r) => (
                  <div key={r.rdNumber} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--status-purple-text)' }}>{r.rdNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly: {formatINR(r.installmentAmount)} • {r.paidInstallments}/{r.totalInstallments} Installments</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>Maturity: {formatINR(r.maturityAmount)}</div>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: FD Accounts */}
      {activeTab === 'fd' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Fixed Deposit (FD) Certificates</h3>
          </div>
          <div className="card-body">
            {(!member.fds || member.fds.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No Fixed Deposits registered.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {member.fds.map((f) => (
                  <div key={f.fdNumber} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{f.fdNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Principal: {formatINR(f.principalAmount)} @ {f.interestRate}% ({f.tenureMonths} Mo)</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--status-success-text)' }}>Maturity: {formatINR(f.maturityAmount)}</div>
                      <StatusBadge status={f.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Loans */}
      {activeTab === 'loans' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Institutional Loans</h3>
          </div>
          <div className="card-body">
            {(!member.loans || member.loans.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No active or past loans found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {member.loans.map((l) => (
                  <div key={l.loanId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{l.loanId} - {l.loanType}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sanctioned: {formatINR(l.approvedAmount || l.requestedAmount)} • EMI: {formatINR(l.emiAmount)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>Outstanding: {formatINR(l.outstandingAmount)}</div>
                      <StatusBadge status={l.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Transactions */}
      {activeTab === 'transactions' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Transaction History</h3>
          </div>
          <div className="card-body">
            {(!member.transactions || member.transactions.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No transaction records for this member yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Type</th>
                    <th>Mode</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {member.transactions.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.id}</td>
                      <td>{t.type}</td>
                      <td>{t.paymentMode}</td>
                      <td style={{ fontWeight: 700, color: t.type === 'Withdrawal' ? 'var(--status-danger)' : 'var(--status-success-text)' }}>
                        {t.type === 'Withdrawal' ? `-${formatINR(t.amount)}` : `+${formatINR(t.amount)}`}
                      </td>
                      <td>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* KYC Review Modal Dialog */}
      <KYCReviewModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        member={member}
        onStatusUpdated={fetchMember}
      />
    </div>
  );
};
