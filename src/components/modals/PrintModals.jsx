import React from 'react';
import { Modal } from '../common/Modal';
import { Printer, Download, Building2, CheckCircle } from 'lucide-react';
import { exportToExcel, printDocument } from '../../services/exportService';
import { formatINR, formatDate } from '../../services/formatters';

export const ReceiptPrintModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    printDocument();
  };

  const handleDownloadExcel = () => {
    const data = [
      { Parameter: "Receipt Number", Value: receipt.receiptNo || receipt.id },
      { Parameter: "Date & Time", Value: receipt.date },
      { Parameter: "Member ID", Value: receipt.memberId },
      { Parameter: "Member Name", Value: receipt.memberName },
      { Parameter: "Transaction Type", Value: receipt.collectionType || receipt.type },
      { Parameter: "Payment Mode", Value: receipt.paymentMode },
      { Parameter: "Total Amount (INR)", Value: receipt.amount },
      { Parameter: "Processed By", Value: receipt.collectedBy || "Authorized Cashier" },
      { Parameter: "Status", Value: receipt.status || "Completed" },
      { Parameter: "Branch", Value: receipt.branch || "Bhubaneswar Main" }
    ];
    exportToExcel(data, `Receipt_${receipt.receiptNo || receipt.id}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Receipt"
      subtitle={`Official institutional proof of payment #${receipt.receiptNo || receipt.id}`}
      size="md"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownloadExcel}
            style={{ backgroundColor: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} />
            <span>Download Receipt (Excel)</span>
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
        </>
      }
    >
      <div
        id="printable-receipt"
        style={{
          padding: '24px',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Receipt Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Building2 size={24} color="var(--primary-600)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>BankAdmin Co-op Society Ltd.</h3>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Licensed Under State Co-operative Societies Act • Reg #ORS/COOP/2018-912
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '8px', color: 'var(--primary-700)' }}>
            OFFICIAL PAYMENT RECEIPT
          </div>
        </div>

        {/* Receipt Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>Receipt No:</span> <strong>{receipt.receiptNo || receipt.id}</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Date:</span> <strong>{receipt.date}</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Member ID:</span> <strong>{receipt.memberId}</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Member Name:</span> <strong>{receipt.memberName}</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> <strong>{receipt.collectionType || receipt.type}</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span> <strong>{receipt.paymentMode}</strong></div>
        </div>

        {/* Amount Box */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--primary-700)', fontWeight: 700 }}>
            Total Amount Received
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            {formatINR(receipt.amount)}
          </div>
        </div>

        {/* Footer & Signature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>
            <div>Cashier: {receipt.collectedBy || "Authorized Officer"}</div>
            <div>Computer Generated • No Signature Required</div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-success-text)', fontWeight: 700 }}>
            <CheckCircle size={16} />
            <span>PAID & VERIFIED</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const StatementPrintModal = ({ isOpen, onClose, account }) => {
  if (!isOpen || !account) return null;

  const handlePrint = () => {
    printDocument();
  };

  const handleDownloadExcel = () => {
    const formattedRows = (account.transactions || []).map(t => ({
      "Transaction ID": t.id,
      "Date": t.date,
      "Type": t.type,
      "Payment Mode": t.paymentMode,
      "Amount (INR)": t.amount,
      "Balance (INR)": t.newBalance || account.balance,
      "Reference": t.referenceNo || "N/A",
      "Status": t.status || "Completed"
    }));

    exportToExcel(formattedRows, `Statement_${account.accountNumber}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Account Statement - ${account.accountNumber}`}
      subtitle={`Member: ${account.memberName} • Current Balance: ${formatINR(account.balance)}`}
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownloadExcel}
            style={{ backgroundColor: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} />
            <span>Download Statement (Excel)</span>
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Statement</span>
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Account Top Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Holder</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{account.memberName}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Number</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-600)' }}>{account.accountNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Balance</div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--status-success-text)' }}>{formatINR(account.balance)}</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Mode</th>
                <th>Amount</th>
                <th>New Balance</th>
              </tr>
            </thead>
            <tbody>
              {(!account.transactions || account.transactions.length === 0) ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No recorded transactions for this account statement period.
                  </td>
                </tr>
              ) : (
                account.transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.id}</td>
                    <td>{t.date}</td>
                    <td>{t.type}</td>
                    <td>{t.paymentMode}</td>
                    <td style={{ fontWeight: 700, color: t.type === 'Withdrawal' ? 'var(--status-danger)' : 'var(--status-success)' }}>
                      {t.type === 'Withdrawal' ? `-${formatINR(t.amount)}` : `+${formatINR(t.amount)}`}
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatINR(t.newBalance || account.balance)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
