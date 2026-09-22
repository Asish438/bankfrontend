export const mockAccounting = {
  summary: {
    totalIncome: 1845000,
    totalExpenses: 792000,
    cashBalance: 420000,
    bankBalance: 3250000,
    netProfit: 1053000
  },
  incomeCategories: [
    "Loan Interest",
    "Processing Fees",
    "Account Service Charges",
    "Late Payment Penalty",
    "Locker Rent",
    "Other Operating Income"
  ],
  expenseCategories: [
    "Staff Salary & Allowances",
    "Branch Office Rent",
    "Electricity & Power",
    "Software & IT Maintenance",
    "Stationery & Printing",
    "Audit & Legal Fees",
    "Interest Paid on Savings / FD",
    "Other Office Expense"
  ],
  transactions: [
    {
      id: "ACC-TXN-101",
      date: "2026-09-22",
      description: "Loan Interest Realization for Sep 2026",
      category: "Loan Interest",
      type: "Income",
      debit: 0,
      credit: 85400,
      balance: 3670000,
      paymentMode: "Auto-Debit",
      reference: "INT-SEP-26"
    },
    {
      id: "ACC-TXN-102",
      date: "2026-09-21",
      description: "Branch Electricity & Power Bill (Bhubaneswar Main)",
      category: "Electricity & Power",
      type: "Expense",
      debit: 14200,
      credit: 0,
      balance: 3584600,
      paymentMode: "Bank Transfer",
      reference: "TPCODL-SEP-01"
    },
    {
      id: "ACC-TXN-103",
      date: "2026-09-20",
      description: "Member Loan Processing Fee for LN10024",
      category: "Processing Fees",
      type: "Income",
      debit: 0,
      credit: 4250,
      balance: 3598800,
      paymentMode: "UPI",
      reference: "PROC-LN10024"
    },
    {
      id: "ACC-TXN-104",
      date: "2026-09-18",
      description: "Quarterly IT Cloud & Core Banking Software Maintenance",
      category: "Software & IT Maintenance",
      type: "Expense",
      debit: 45000,
      credit: 0,
      balance: 3594550,
      paymentMode: "Bank Transfer",
      reference: "INV-IT-891"
    },
    {
      id: "ACC-TXN-105",
      date: "2026-09-15",
      description: "Late Payment Penalty collected on Overdue LN10025",
      category: "Late Payment Penalty",
      type: "Income",
      debit: 0,
      credit: 1200,
      balance: 3639550,
      paymentMode: "Cash",
      reference: "PEN-LN10025"
    },
    {
      id: "ACC-TXN-106",
      date: "2026-09-10",
      description: "Passbook Printing & Office Stationery Supplies",
      category: "Stationery & Printing",
      type: "Expense",
      debit: 18500,
      credit: 0,
      balance: 3638350,
      paymentMode: "Cash",
      reference: "STAT-09-26"
    },
    {
      id: "ACC-TXN-107",
      date: "2026-09-01",
      description: "Staff Salary & Allowances for August 2026 (18 staff)",
      category: "Staff Salary & Allowances",
      type: "Expense",
      debit: 520000,
      credit: 0,
      balance: 3656850,
      paymentMode: "Bank Transfer",
      reference: "SAL-AUG-26"
    },
    {
      id: "ACC-TXN-108",
      date: "2026-09-01",
      description: "Monthly Rent for Bhubaneswar Main & Cuttack Branches",
      category: "Branch Office Rent",
      type: "Expense",
      debit: 85000,
      credit: 0,
      balance: 4176850,
      paymentMode: "Bank Transfer",
      reference: "RNT-SEP-26"
    }
  ]
};
