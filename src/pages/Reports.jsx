import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  Search,
  Users,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  Landmark,
  Wallet,
  Receipt,
  TrendingUp,
  FileText,
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import { api } from '../services/api';
import { formatINR, formatDate } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { useNotifications } from '../context/NotificationContext';

export const Reports = () => {
  const [reportType, setReportType] = useState('members');
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-09-22');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useNotifications();

  const reportOptions = [
    { id: 'members', label: 'Member Directory', icon: Users, filename: 'Members_Directory' },
    { id: 'kyc', label: 'KYC Compliance Report', icon: ShieldCheck, filename: 'KYC_Compliance_Ledger' },
    { id: 'savings', label: 'Savings Accounts Ledger', icon: CreditCard, filename: 'Savings_Accounts_Report' },
    { id: 'rd', label: 'Recurring Deposits Report', icon: PiggyBank, filename: 'RD_Portfolio_Report' },
    { id: 'fd', label: 'Fixed Deposits Report', icon: Landmark, filename: 'FD_Investments_Report' },
    { id: 'loans', label: 'Loan Portfolio & NPA', icon: Wallet, filename: 'Loans_Portfolio_NPA' },
    { id: 'collections', label: 'Cashier Collection Log', icon: Receipt, filename: 'Cashier_Collections_Log' },
    { id: 'income', label: 'Institutional Income Log', icon: TrendingUp, filename: 'Institutional_Income_Report' },
    { id: 'expense', label: 'Operating Expense Log', icon: TrendingUp, filename: 'Operating_Expenses_Report' },
    { id: 'transactions', label: 'Transaction Audit Trail', icon: FileText, filename: 'Transactions_Audit_Trail' }
  ];

  const generateReport = async () => {
    setIsLoading(true);
    try {
      if (reportType === 'members' || reportType === 'kyc') {
        const res = await api.getMembers();
        setReportData(res);
      } else if (reportType === 'savings') {
        const res = await api.getSavingsAccounts();
        setReportData(res);
      } else if (reportType === 'rd') {
        const res = await api.getRDAccounts();
        setReportData(res);
      } else if (reportType === 'fd') {
        const res = await api.getFDAccounts();
        setReportData(res);
      } else if (reportType === 'loans') {
        const res = await api.getLoans();
        setReportData(res);
      } else if (reportType === 'collections') {
        const res = await api.getCollections();
        setReportData(res);
      } else if (reportType === 'income' || reportType === 'expense') {
        const res = await api.getAccountingData();
        const txns = res.transactions.filter(t => t.type === (reportType === 'income' ? 'Income' : 'Expense'));
        setReportData(txns);
      } else {
        const res = await api.getAccountingData();
        setReportData(res.transactions);
      }
      showToast("Report generated in Excel-ready format.", "success");
    } catch (e) {
      showToast("Failed to generate report.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [reportType]);

  // Search filter
  useEffect(() => {
    let result = [...reportData];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(val =>
          val && String(val).toLowerCase().includes(q)
        );
      });
    }
    setFilteredData(result);
  }, [searchQuery, reportData]);

  // Formats data cleanly for Excel Spreadsheet download
  const getFormattedExcelData = () => {
    const dataToExport = filteredData.length ? filteredData : reportData;

    switch (reportType) {
      case 'members':
        return dataToExport.map(m => ({
          "Member ID": m.id,
          "Full Name": m.name,
          "Mobile Number": m.mobile,
          "Email Address": m.email || "N/A",
          "Gender": m.gender || "N/A",
          "Branch": m.branch || "Bhubaneswar Main",
          "Joining Date": m.joiningDate,
          "KYC Status": m.kycStatus,
          "Account Status": m.accountStatus
        }));

      case 'kyc':
        return dataToExport.map(m => ({
          "Member ID": m.id,
          "Member Name": m.name,
          "Mobile": m.mobile,
          "KYC Status": m.kycStatus,
          "ID Proof Type": m.documents?.idProof || "Aadhaar Card",
          "Address Proof Type": m.documents?.addressProof || "Utility Bill",
          "PAN Card Ref": m.documents?.panCard || "NOT_PROVIDED",
          "Reviewed By": m.kycReviewedBy || "Pending Review",
          "Joined Date": m.joiningDate
        }));

      case 'savings':
        return dataToExport.map(s => ({
          "Account Number": s.accountNumber,
          "Member ID": s.memberId,
          "Account Holder": s.memberName,
          "Mobile": s.mobile,
          "Account Type": s.accountType || "Standard Savings",
          "Balance (INR)": s.balance,
          "Nominee": s.nomineeName || "N/A",
          "Branch": s.branch,
          "Status": s.status,
          "Opening Date": s.openingDate
        }));

      case 'rd':
        return dataToExport.map(r => ({
          "RD Number": r.rdNumber,
          "Member ID": r.memberId,
          "Member Name": r.memberName,
          "Monthly Installment (INR)": r.installmentAmount,
          "Tenure (Months)": r.tenureMonths,
          "Paid Installments": r.paidInstallments,
          "Total Installments": r.totalInstallments,
          "Interest Rate (%)": `${r.interestRate}%`,
          "Total Paid (INR)": r.installmentAmount * (r.paidInstallments || 0),
          "Maturity Amount (INR)": r.maturityAmount,
          "Start Date": r.startDate,
          "Maturity Date": r.maturityDate,
          "Status": r.status
        }));

      case 'fd':
        return dataToExport.map(f => ({
          "FD Number": f.fdNumber,
          "Member ID": f.memberId,
          "Member Name": f.memberName,
          "Principal Amount (INR)": f.depositAmount,
          "Tenure (Months)": f.tenureMonths,
          "Interest Rate (%)": `${f.interestRate}%`,
          "Maturity Amount (INR)": f.maturityAmount,
          "Interest Payout": f.interestPayout || "On Maturity",
          "Deposit Date": f.startDate,
          "Maturity Date": f.maturityDate,
          "Status": f.status
        }));

      case 'loans':
        return dataToExport.map(l => ({
          "Loan ID": l.loanId,
          "Member ID": l.memberId,
          "Borrower Name": l.memberName,
          "Loan Category": l.loanType,
          "Sanctioned Amount (INR)": l.approvedAmount || l.requestedAmount,
          "Outstanding Principal (INR)": l.outstandingBalance || 0,
          "Interest Rate (%)": `${l.interestRate}%`,
          "Tenure (Months)": l.tenureMonths,
          "Monthly EMI (INR)": l.monthlyEmi,
          "Disbursed Date": l.disbursementDate || "Pending",
          "Next Due Date": l.nextDueDate || "N/A",
          "Status": l.status
        }));

      case 'collections':
        return dataToExport.map(c => ({
          "Receipt Number": c.receiptNo || c.id,
          "Collection Date": c.date,
          "Account / Loan Ref": c.accountNumber || c.memberId,
          "Member Name": c.memberName,
          "Payment Mode": c.paymentMode,
          "Collected Amount (INR)": c.amount,
          "Cashier": c.collectedBy || "Current Cashier",
          "Status": c.status || "Completed"
        }));

      case 'income':
      case 'expense':
        return dataToExport.map(t => ({
          "Voucher ID": t.id,
          "Date": t.date,
          "Transaction Type": t.type,
          "Category": t.category,
          "Description": t.description,
          "Amount (INR)": t.type === 'Income' ? t.credit : t.debit,
          "Payment Mode": t.paymentMode,
          "Voucher Reference": t.reference
        }));

      default:
        return dataToExport.map(t => ({
          "Transaction ID": t.id,
          "Date & Time": t.date,
          "Account Number": t.accountNumber || "N/A",
          "Member Name": t.memberName || "N/A",
          "Type": t.type,
          "Amount (INR)": t.amount,
          "Balance (INR)": t.balance || 0,
          "Payment Mode": t.paymentMode || "Cash",
          "Reference Number": t.referenceNo || "N/A",
          "Status": t.status || "Success"
        }));
    }
  };

  const handleDownloadExcel = () => {
    const formattedData = getFormattedExcelData();
    if (!formattedData || !formattedData.length) {
      showToast("No data available to download.", "warning");
      return;
    }

    const currentOption = reportOptions.find(r => r.id === reportType);
    const filename = `BankAdmin_${currentOption?.filename || 'Report'}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    exportToExcel(formattedData, filename);
    showToast(`Excel spreadsheet "${filename}" downloaded successfully!`, "success");
  };

  const currentOption = reportOptions.find(r => r.id === reportType);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet size={28} color="#10b981" /> Financial & Regulatory Reports (Excel Hub)
          </h1>
          <p className="page-subtitle">Generate and download comprehensive institutional datasets exclusively in formatted Excel (.xlsx) format.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleDownloadExcel}
            style={{
              backgroundColor: '#059669',
              borderColor: '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              padding: '10px 18px',
              fontSize: '0.92rem'
            }}
          >
            <Download size={18} />
            <span>Download in Excel Format (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Report Categories Navigation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px'
        }}
      >
        {reportOptions.map((opt) => {
          const isSelected = reportType === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => setReportType(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? '2px solid #059669' : '1px solid var(--border-color)',
                backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface)',
                color: isSelected ? '#059669' : 'var(--text-main)',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.84rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={16} color={isSelected ? '#059669' : 'var(--text-muted)'} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Parameters Card */}
      <div className="card">
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="var(--text-muted)" />
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ width: '150px' }}
              />
              <span style={{ color: 'var(--text-muted)' }}>to</span>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ width: '150px' }}
              />
            </div>

            <select
              className="form-control"
              style={{ width: '180px' }}
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="ALL">All Branches</option>
              <option value="Bhubaneswar">Bhubaneswar Main</option>
              <option value="Cuttack">Cuttack Central</option>
              <option value="Puri">Puri Beach Road</option>
              <option value="Rourkela">Rourkela Main</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search records..."
              width="260px"
            />
            <button
              className="btn btn-primary"
              onClick={handleDownloadExcel}
              style={{
                backgroundColor: '#059669',
                borderColor: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={16} />
              <span>Export to Excel</span>
            </button>
          </div>
        </div>

        {/* Dataset Summary Banner */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'var(--bg-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 600 }}>
            <TableIcon size={16} color="#059669" />
            <span>Active Sheet: <strong>{currentOption?.label}</strong> ({filteredData.length} records ready for Excel export)</span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Output Format: <strong>Microsoft Excel Spreadsheet (.xlsx)</strong>
          </div>
        </div>

        {/* Report Preview Data Table */}
        <div style={{ padding: '20px' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {filteredData.length > 0 &&
                    Object.keys(filteredData[0]).slice(0, 8).map((key) => (
                      <th key={key}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No records matched the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredData.slice(0, 15).map((row, idx) => (
                    <tr key={idx}>
                      {Object.keys(filteredData[0]).slice(0, 8).map((k) => {
                        const val = row[k];
                        const isAmt = (typeof val === 'number' || (!isNaN(val) && typeof val === 'string')) && (k.toLowerCase().includes('amount') || k.toLowerCase().includes('balance') || k.toLowerCase().includes('emi'));
                        return (
                          <td key={k}>
                            {isAmt
                              ? formatINR(val)
                              : typeof val === 'object'
                              ? JSON.stringify(val).slice(0, 25)
                              : String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing preview of top 15 records. Complete dataset ({filteredData.length} rows) is included in the Excel download.
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadExcel}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}
            >
              <Download size={14} /> Download Full Excel (.xlsx)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
