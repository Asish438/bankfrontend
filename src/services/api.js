/**
 * API Service Layer for BankAdmin Portal
 * Organised for seamless plug-in to a future Spring Boot REST API
 */

import { mockMembers } from '../data/mockMembers';
import { mockSavings } from '../data/mockSavings';
import { mockRD } from '../data/mockRD';
import { mockFD } from '../data/mockFD';
import { mockLoans } from '../data/mockLoans';
import { mockTransactions } from '../data/mockTransactions';
import { mockCollections } from '../data/mockCollections';
import { mockAccounting } from '../data/mockAccounting';
import { mockStaff } from '../data/mockStaff';
import { mockAuditLogs } from '../data/mockAuditLogs';
import { mockNotifications } from '../data/mockNotifications';

// Initialize localStorage persistence for dummy CRUD mutations
const getStored = (key, fallback) => {
  try {
    const data = localStorage.getItem(`bankadmin_${key}`);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
    }
    return parsed || fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(`bankadmin_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage error:", e);
  }
};

// Simulated network delay helper
const delay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // ---------------- Dashboard ----------------
  async getDashboardData() {
    await delay();
    const members = getStored('members', mockMembers);
    const savings = getStored('savings', mockSavings);
    const rd = getStored('rd', mockRD);
    const fd = getStored('fd', mockFD);
    const loans = getStored('loans', mockLoans);
    const transactions = getStored('transactions', mockTransactions);

    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.accountStatus === 'Active').length;
    const pendingKYC = members.filter(m => m.kycStatus === 'Pending' || m.kycStatus === 'Under Review').length;
    const savingsCount = savings.length;
    const rdCount = rd.length;
    const fdCount = fd.length;
    const activeLoans = loans.filter(l => l.status === 'Active').length;
    const todayCollection = 485230;

    return {
      stats: {
        totalMembers,
        activeMembers,
        pendingKYC,
        savingsAccounts: savingsCount,
        rdAccounts: rdCount,
        fdAccounts: fdCount,
        activeLoans,
        todayCollection,
      },
      memberGrowth: [
        { month: 'Jan', members: 820 },
        { month: 'Feb', members: 890 },
        { month: 'Mar', members: 940 },
        { month: 'Apr', members: 995 },
        { month: 'May', members: 1045 },
        { month: 'Jun', members: 1110 },
        { month: 'Jul', members: 1170 },
        { month: 'Aug', members: 1215 },
        { month: 'Sep', members: 1248 },
      ],
      collectionOverview: [
        { month: 'Apr', Cash: 180000, UPI: 220000, BankTransfer: 140000 },
        { month: 'May', Cash: 195000, UPI: 240000, BankTransfer: 160000 },
        { month: 'Jun', Cash: 210000, UPI: 280000, BankTransfer: 190000 },
        { month: 'Jul', Cash: 230000, UPI: 310000, BankTransfer: 210000 },
        { month: 'Aug', Cash: 220000, UPI: 350000, BankTransfer: 240000 },
        { month: 'Sep', Cash: 245000, UPI: 390000, BankTransfer: 270000 },
      ],
      loanStatusDistribution: [
        { name: 'Active', value: 98, color: '#3b82f6' },
        { name: 'Pending', value: 24, color: '#f59e0b' },
        { name: 'Approved', value: 16, color: '#10b981' },
        { name: 'Overdue', value: 12, color: '#ef4444' },
        { name: 'Completed', value: 65, color: '#8b5cf6' },
        { name: 'Rejected', value: 14, color: '#64748b' },
      ],
      recentMembers: members.slice(0, 5),
      recentTransactions: transactions.slice(0, 6)
    };
  },

  // ---------------- Members & KYC ----------------
  async getMembers() {
    await delay();
    return getStored('members', mockMembers);
  },

  async getMemberById(id) {
    await delay();
    const members = getStored('members', mockMembers);
    const member = members.find(m => m.id?.toLowerCase() === String(id).toLowerCase()) || members[0] || mockMembers[0];

    const savings = getStored('savings', mockSavings).filter(s => s.memberId?.toLowerCase() === member.id?.toLowerCase());
    const rds = getStored('rd', mockRD).filter(r => r.memberId?.toLowerCase() === member.id?.toLowerCase());
    const fds = getStored('fd', mockFD).filter(f => f.memberId?.toLowerCase() === member.id?.toLowerCase());
    const loans = getStored('loans', mockLoans).filter(l => l.memberId?.toLowerCase() === member.id?.toLowerCase());
    const transactions = getStored('transactions', mockTransactions).filter(t => t.memberId?.toLowerCase() === member.id?.toLowerCase());

    return {
      ...member,
      savings,
      rds,
      fds,
      loans,
      transactions
    };
  },

  async createMember(memberData) {
    await delay(300);
    const members = getStored('members', mockMembers);
    const nextId = `M10${members.length + 1}`;
    const newMember = {
      id: nextId,
      ...memberData,
      name: `${memberData.firstName} ${memberData.middleName ? memberData.middleName + ' ' : ''}${memberData.lastName}`,
      kycStatus: "Pending",
      accountStatus: "Active",
      joiningDate: new Date().toISOString().split('T')[0],
      kycSubmittedDate: new Date().toISOString().split('T')[0],
      kycReviewedBy: "-",
      documents: {
        photo: memberData.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        idProof: memberData.idProofType ? `${memberData.idProofType} (${memberData.idProofNumber || 'DOC-PROOF'})` : "Aadhaar Card (Pending Upload)",
        addressProof: memberData.addressProofType || "Electricity Utility Bill",
        panCard: memberData.panCard || "NOT_PROVIDED",
        status: "Pending"
      }
    };

    const updated = [newMember, ...members];
    setStored('members', updated);
    this.addAuditLog("MEMBER_CREATED", "Members", `Created new member profile ${newMember.id} (${newMember.name})`);
    return newMember;
  },

  async updateMember(id, memberData) {
    await delay(200);
    const members = getStored('members', mockMembers);
    const index = members.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Member not found");

    members[index] = { ...members[index], ...memberData };
    setStored('members', members);
    this.addAuditLog("MEMBER_UPDATED", "Members", `Updated member profile details for ${id}`);
    return members[index];
  },

  async approveKYC(memberId, reviewer = "Ashok Jena (KYC Officer)") {
    await delay(250);
    const members = getStored('members', mockMembers);
    const member = members.find(m => m.id === memberId);
    if (member) {
      member.kycStatus = "Approved";
      member.accountStatus = "Active";
      member.kycReviewedBy = reviewer;
      if (member.documents) {
        member.documents.status = "Approved";
      }
      setStored('members', members);
      this.addAuditLog("KYC_APPROVED", "KYC", `Approved KYC verification for Member ${memberId} (${member.name})`);
    }
    return member;
  },

  async rejectKYC(memberId, reason, reviewer = "Ashok Jena (KYC Officer)") {
    await delay(250);
    const members = getStored('members', mockMembers);
    const member = members.find(m => m.id === memberId);
    if (member) {
      member.kycStatus = "Rejected";
      member.kycReviewedBy = reviewer;
      if (member.documents) {
        member.documents.status = "Rejected";
        member.documents.rejectionReason = reason;
      }
      setStored('members', members);
      this.addAuditLog("KYC_REJECTED", "KYC", `Rejected KYC for Member ${memberId}. Reason: ${reason}`);
    }
    return member;
  },

  // ---------------- Savings Accounts ----------------
  async getSavingsAccounts() {
    await delay();
    return getStored('savings', mockSavings);
  },

  async getSavingsById(accountNumber) {
    await delay();
    const savings = getStored('savings', mockSavings);
    const account = savings.find(s =>
      s.accountNumber?.toLowerCase() === String(accountNumber).toLowerCase() ||
      s.memberId?.toLowerCase() === String(accountNumber).toLowerCase()
    ) || savings[0] || mockSavings[0];

    const transactions = getStored('transactions', mockTransactions).filter(
      t => t.accountNumber?.toLowerCase() === account.accountNumber?.toLowerCase() ||
           t.memberId?.toLowerCase() === account.memberId?.toLowerCase()
    );

    return {
      ...account,
      transactions
    };
  },

  async toggleAccountFreeze(accountNumber, reason = "") {
    await delay(200);
    const savings = getStored('savings', mockSavings);
    const acc = savings.find(s => s.accountNumber === accountNumber);
    if (acc) {
      const newStatus = acc.status === "Active" ? "Frozen" : "Active";
      acc.status = newStatus;
      setStored('savings', savings);
      this.addAuditLog("ACCOUNT_UPDATED", "Savings", `Changed status of account ${accountNumber} to ${newStatus}. ${reason ? 'Note: ' + reason : ''}`);
    }
    return acc;
  },

  // ---------------- RD Management ----------------
  async getRDAccounts() {
    await delay();
    return getStored('rd', mockRD);
  },

  // ---------------- FD Management ----------------
  async getFDAccounts() {
    await delay();
    return getStored('fd', mockFD);
  },

  async renewFD(fdNumber) {
    await delay(200);
    const fds = getStored('fd', mockFD);
    const fd = fds.find(f => f.fdNumber === fdNumber);
    if (fd) {
      fd.status = "Active";
      fd.startDate = new Date().toISOString().split('T')[0];
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + fd.tenureMonths);
      fd.maturityDate = nextDate.toISOString().split('T')[0];
      setStored('fd', fds);
      this.addAuditLog("ACCOUNT_UPDATED", "FD", `Renewed Fixed Deposit ${fdNumber}`);
    }
    return fd;
  },

  async closeFD(fdNumber) {
    await delay(200);
    const fds = getStored('fd', mockFD);
    const fd = fds.find(f => f.fdNumber === fdNumber);
    if (fd) {
      fd.status = "Closed";
      setStored('fd', fds);
      this.addAuditLog("ACCOUNT_UPDATED", "FD", `Premature/Maturity closure executed for FD ${fdNumber}`);
    }
    return fd;
  },

  // ---------------- Loan Management ----------------
  async getLoans() {
    await delay();
    return getStored('loans', mockLoans);
  },

  async getLoanById(loanId) {
    await delay();
    const loans = getStored('loans', mockLoans);
    const loan = loans.find(l =>
      l.loanId?.toLowerCase() === String(loanId).toLowerCase() ||
      l.memberId?.toLowerCase() === String(loanId).toLowerCase()
    ) || loans[0] || mockLoans[0];
    return loan;
  },

  async approveLoan(loanId, approvedAmount, remarks = "") {
    await delay(250);
    const loans = getStored('loans', mockLoans);
    const loan = loans.find(l => l.loanId === loanId);
    if (loan) {
      loan.status = "Approved";
      loan.approvedAmount = Number(approvedAmount) || loan.requestedAmount;
      loan.disbursementDate = new Date().toISOString().split('T')[0];
      setStored('loans', loans);
      this.addAuditLog("LOAN_APPROVED", "Loans", `Approved Loan ${loanId} for ${loan.approvedAmount}. Remarks: ${remarks}`);
    }
    return loan;
  },

  async rejectLoan(loanId, reason) {
    await delay(250);
    const loans = getStored('loans', mockLoans);
    const loan = loans.find(l => l.loanId === loanId);
    if (loan) {
      loan.status = "Rejected";
      loan.rejectionReason = reason;
      setStored('loans', loans);
      this.addAuditLog("LOAN_REJECTED", "Loans", `Rejected Loan application ${loanId}. Reason: ${reason}`);
    }
    return loan;
  },

  // ---------------- Collections & Cashier ----------------
  async getCollections() {
    await delay();
    return getStored('collections', mockCollections);
  },

  async addCollection(collectionData) {
    await delay(200);
    const collections = getStored('collections', mockCollections);
    const nextId = `COL89${collections.length + 1}`;
    const newRecord = {
      id: nextId,
      receiptNo: `RCP-2026-09-${String(collections.length + 1).padStart(3, '0')}`,
      ...collectionData,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: "Completed"
    };
    const updated = [newRecord, ...collections];
    setStored('collections', updated);
    this.addAuditLog("DEPOSIT", "Cashier", `Generated collection receipt ${newRecord.receiptNo} for ₹${newRecord.amount} (${newRecord.paymentMode})`);
    return newRecord;
  },

  // ---------------- Accounting ----------------
  async getAccountingData() {
    await delay();
    return getStored('accounting', mockAccounting);
  },

  async addIncome(incomeData) {
    await delay(200);
    const acc = getStored('accounting', mockAccounting);
    const newTxn = {
      id: `ACC-TXN-${acc.transactions.length + 101}`,
      date: new Date().toISOString().split('T')[0],
      description: incomeData.description,
      category: incomeData.category,
      type: "Income",
      debit: 0,
      credit: Number(incomeData.amount),
      balance: acc.summary.bankBalance + Number(incomeData.amount),
      paymentMode: incomeData.paymentMode || "Bank Transfer",
      reference: incomeData.reference || "INC-MANUAL"
    };
    acc.transactions.unshift(newTxn);
    acc.summary.totalIncome += Number(incomeData.amount);
    acc.summary.bankBalance += Number(incomeData.amount);
    setStored('accounting', acc);
    this.addAuditLog("ACCOUNT_CREATED", "Accounting", `Recorded income entry of ₹${incomeData.amount} for ${incomeData.category}`);
    return newTxn;
  },

  async addExpense(expenseData) {
    await delay(200);
    const acc = getStored('accounting', mockAccounting);
    const newTxn = {
      id: `ACC-TXN-${acc.transactions.length + 101}`,
      date: new Date().toISOString().split('T')[0],
      description: expenseData.description,
      category: expenseData.category,
      type: "Expense",
      debit: Number(expenseData.amount),
      credit: 0,
      balance: acc.summary.bankBalance - Number(expenseData.amount),
      paymentMode: expenseData.paymentMode || "Bank Transfer",
      reference: expenseData.reference || "EXP-MANUAL"
    };
    acc.transactions.unshift(newTxn);
    acc.summary.totalExpenses += Number(expenseData.amount);
    acc.summary.bankBalance -= Number(expenseData.amount);
    setStored('accounting', acc);
    this.addAuditLog("ACCOUNT_CREATED", "Accounting", `Recorded expense voucher of ₹${expenseData.amount} for ${expenseData.category}`);
    return newTxn;
  },

  // ---------------- Staff ----------------
  async getStaff() {
    await delay();
    return getStored('staff', mockStaff);
  },

  async addStaff(staffData) {
    await delay(200);
    const staffList = getStored('staff', mockStaff);
    const newStaff = {
      id: `STF${staffList.length + 101}`,
      ...staffData,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: "Never"
    };
    const updated = [newStaff, ...staffList];
    setStored('staff', updated);
    this.addAuditLog("ACCOUNT_CREATED", "Staff", `Created administrative user account ${newStaff.name} (${newStaff.role})`);
    return newStaff;
  },

  async toggleStaffStatus(staffId) {
    await delay(150);
    const staffList = getStored('staff', mockStaff);
    const staff = staffList.find(s => s.id === staffId);
    if (staff) {
      staff.status = staff.status === "Active" ? "Inactive" : "Active";
      setStored('staff', staffList);
      this.addAuditLog("ACCOUNT_UPDATED", "Staff", `Toggled status of user ${staff.name} to ${staff.status}`);
    }
    return staff;
  },

  // ---------------- Audit Logs ----------------
  async getAuditLogs() {
    await delay();
    return getStored('audit_logs', mockAuditLogs);
  },

  addAuditLog(action, module, description, status = "Success") {
    const logs = getStored('audit_logs', mockAuditLogs);
    const newLog = {
      id: `LOG-90${String(logs.length + 1).padStart(2, '0')}`,
      user: "Current Admin (Session)",
      action,
      module,
      description,
      ipAddress: "192.168.1.104",
      dateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status
    };
    logs.unshift(newLog);
    setStored('audit_logs', logs.slice(0, 100));
  },

  // ---------------- Global Search ----------------
  async globalSearch(query) {
    if (!query || query.trim().length < 2) return { members: [], accounts: [], loans: [], transactions: [] };
    const q = query.trim().toLowerCase();

    const members = getStored('members', mockMembers).filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.mobile.includes(q)
    ).slice(0, 4);

    const accounts = getStored('savings', mockSavings).filter(s =>
      s.accountNumber.toLowerCase().includes(q) ||
      s.memberName.toLowerCase().includes(q)
    ).slice(0, 4);

    const loans = getStored('loans', mockLoans).filter(l =>
      l.loanId.toLowerCase().includes(q) ||
      l.memberName.toLowerCase().includes(q)
    ).slice(0, 4);

    const transactions = getStored('transactions', mockTransactions).filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.referenceNo.toLowerCase().includes(q) ||
      t.memberName.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      members,
      accounts,
      loans,
      transactions
    };
  }
};
