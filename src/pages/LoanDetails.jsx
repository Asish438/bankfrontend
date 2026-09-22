import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Wallet,
  User,
  Calendar,
  Building,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  Download,
  Printer
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate, formatMobile } from '../services/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { Tabs } from '../components/common/FormControls';
import { Table } from '../components/common/Table';
import { LoadingState, Breadcrumb } from '../components/common/DisplayComponents';
import { LoanApprovalModal, LoanRejectModal } from '../components/modals/LoanModals';
import { exportToExcel, printDocument } from '../services/exportService';
import { useNotifications } from '../context/NotificationContext';

export const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const fetchLoan = async () => {
    try {
      setIsLoading(true);
      const res = await api.getLoanById(id);
      setLoan(res);
    } catch (e) {
      console.error(e);
      showToast("Loan record not found.", "error");
      navigate('/loans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [id]);

  if (isLoading || !loan) {
    return <LoadingState message="Loading loan record & amortization schedule..." />;
  }

  const handlePrintSchedule = () => {
    printDocument();
  };

  const handleDownloadScheduleExcel = () => {
    const rawSchedule = loan.schedule && loan.schedule.length > 0
      ? loan.schedule
      : Array.from({ length: loan.tenureMonths || 24 }).map((_, i) => ({
          emiNo: i + 1,
          dueDate: `2024-0${((i % 9) + 1)}-10`,
          principal: Math.round(loan.emiAmount * 0.8),
          interest: Math.round(loan.emiAmount * 0.2),
          emiAmount: loan.emiAmount,
          paidAmount: i < 3 ? loan.emiAmount : 0,
          status: i < 3 ? "Paid" : "Pending"
        }));

    const formattedSchedule = rawSchedule.map(s => ({
      "Loan ID": loan.loanId,
      "Borrower": loan.memberName,
      "EMI No": `EMI #${s.emiNo}`,
      "Due Date": s.dueDate,
      "Principal (INR)": s.principal,
      "Interest (INR)": s.interest,
      "Total EMI (INR)": s.emiAmount,
      "Paid Amount (INR)": s.paidAmount || 0,
      "Status": s.status
    }));

    exportToExcel(formattedSchedule, `Loan_Schedule_${loan.loanId}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Loan amortization schedule exported as Excel spreadsheet (.xlsx).", "success");
  };

  const emiList = loan.schedule && loan.schedule.length > 0
    ? loan.schedule
    : Array.from({ length: Math.min(loan.tenureMonths || 24, 24) }).map((_, i) => ({
        emiNo: i + 1,
        dueDate: `2025-${String(((i % 12) + 1)).padStart(2, '0')}-10`,
        principal: Math.round(loan.emiAmount * 0.8),
        interest: Math.round(loan.emiAmount * 0.2),
        emiAmount: loan.emiAmount,
        paidAmount: i < (loan.status === 'Completed' ? 24 : (loan.status === 'Active' ? 4 : 0)) ? loan.emiAmount : 0,
        status: i < (loan.status === 'Completed' ? 24 : (loan.status === 'Active' ? 4 : 0)) ? "Paid" : (loan.status === 'Overdue' && i === 4 ? "Overdue" : "Pending")
      }));

  const emiColumns = [
    {
      header: 'EMI No.',
      key: 'emiNo',
      render: (val) => <span style={{ fontWeight: 600 }}>Installment #{val}</span>
    },
    { header: 'Due Date', key: 'dueDate' },
    {
      header: 'Principal',
      key: 'principal',
      render: (val) => formatINR(val)
    },
    {
      header: 'Interest',
      key: 'interest',
      render: (val) => formatINR(val)
    },
    {
      header: 'EMI Amount',
      key: 'emiAmount',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{formatINR(val)}</span>
    },
    {
      header: 'Paid Amount',
      key: 'paidAmount',
      render: (val) => <span style={{ fontWeight: 600 }}>{formatINR(val)}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Loan Overview' },
    { id: 'schedule', label: 'EMI Amortization Schedule', badge: emiList.length },
    { id: 'payments', label: 'Payment Ledger' },
    { id: 'documents', label: 'Collateral & Documents' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Breadcrumbs */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Loan Management', link: '/loans' },
            { label: loan.loanId }
          ]}
        />
        <div style={{ marginTop: '8px' }}>
          <Link to="/loans" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>Back to Loans</span>
          </Link>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.4rem', margin: 0 }}>{loan.loanId}</h1>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({loan.loanType})</span>
              <StatusBadge status={loan.status} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} />
                <Link to={`/members/${loan.memberId}`} style={{ fontWeight: 600 }}>
                  {loan.memberName} ({loan.memberId})
                </Link>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building size={14} />
                <span>{loan.branch}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} />
                <span>Disbursed: {formatDate(loan.disbursementDate)}</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {(loan.status === 'Pending' || loan.status === 'Under Review') && (
              <>
                <button className="btn btn-danger" onClick={() => setIsRejectOpen(true)}>
                  <XCircle size={16} />
                  <span>Reject</span>
                </button>
                <button className="btn btn-success" onClick={() => setIsApproveOpen(true)}>
                  <CheckCircle2 size={16} />
                  <span>Approve & Sanction</span>
                </button>
              </>
            )}
            <button
              className="btn btn-primary"
              onClick={handleDownloadScheduleExcel}
              style={{ backgroundColor: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} />
              <span>Download Schedule (Excel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Sanctioned Amount</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '4px' }}>
            {formatINR(loan.approvedAmount || loan.requestedAmount)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Req: {formatINR(loan.requestedAmount)}</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Installment (EMI)</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {formatINR(loan.emiAmount)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Due on 10th of every month</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Interest & Tenure</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
            {loan.interestRate}% p.a.
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{loan.tenureMonths} Months tenure</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Current Outstanding</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: loan.status === 'Overdue' ? 'var(--status-danger)' : 'var(--status-success-text)', marginTop: '4px' }}>
            {formatINR(loan.outstandingAmount)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Principal balance remaining</div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Loan Sanction Terms</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Loan Purpose</span>
                <span style={{ fontWeight: 600 }}>{loan.purpose}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Repayment Mode</span>
                <span style={{ fontWeight: 600 }}>{loan.repaymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Guarantor / Co-applicant</span>
                <span style={{ fontWeight: 600 }}>{loan.guarantor}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Credit Committee Appraisal</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>CIBIL / Credit Score</span>
                <span style={{ fontWeight: 700, color: 'var(--status-success-text)' }}>768 (Good)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Appraised By</span>
                <span style={{ fontWeight: 600 }}>Prakash Nayak (Loan Officer)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sanction Authority</span>
                <span style={{ fontWeight: 600 }}>Swati Sucharita (Manager)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">EMI Amortization Schedule</h3>
              <p className="card-subtitle">Principal break-up, interest calculation, and installment due dates</p>
            </div>
          </div>
          <Table columns={emiColumns} data={emiList} keyField="emiNo" />
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Repayment History</h3>
          </div>
          <div className="card-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Amount Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>RCP-LN-2026-001</td>
                  <td>2024-06-08</td>
                  <td>Bank Auto-Debit</td>
                  <td style={{ fontWeight: 700, color: 'var(--status-success-text)' }}>{formatINR(loan.emiAmount)}</td>
                  <td><StatusBadge status="Completed" /></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>RCP-LN-2026-002</td>
                  <td>2024-07-09</td>
                  <td>Bank Auto-Debit</td>
                  <td style={{ fontWeight: 700, color: 'var(--status-success-text)' }}>{formatINR(loan.emiAmount)}</td>
                  <td><StatusBadge status="Completed" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sanction Documents & Collateral Deeds</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <FileText size={24} color="var(--primary-600)" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700 }}>Loan Agreement Form</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Signed & Stamp Duty Verified</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <FileText size={24} color="var(--primary-600)" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700 }}>Promissory Note</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Legal undertaking signed</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <FileText size={24} color="var(--primary-600)" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700 }}>Guarantor Consent Letter</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KYC & salary slip attached</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval & Rejection Modals */}
      <LoanApprovalModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        loan={loan}
        onSuccess={fetchLoan}
      />

      <LoanRejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        loan={loan}
        onSuccess={fetchLoan}
      />
    </div>
  );
};
