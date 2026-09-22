export const mockAuditLogs = [
  {
    id: "LOG-9001",
    user: "Manas Ranjan Mishra (Super Admin)",
    action: "LOGIN",
    module: "Auth",
    description: "Successful administrative login via 2FA Authentication",
    ipAddress: "192.168.1.104",
    dateTime: "2026-09-22 11:20:15",
    status: "Success"
  },
  {
    id: "LOG-9002",
    user: "Ashok Kumar Jena (KYC Officer)",
    action: "KYC_APPROVED",
    module: "KYC",
    description: "Approved Aadhaar and PAN KYC verification for Member M1001",
    ipAddress: "192.168.1.112",
    dateTime: "2026-09-22 11:05:40",
    status: "Success"
  },
  {
    id: "LOG-9003",
    user: "Subhashree Panda (Cashier)",
    action: "DEPOSIT",
    module: "Cashier",
    description: "Processed cash deposit of ₹25,000 for Account SB100201",
    ipAddress: "192.168.1.118",
    dateTime: "2026-09-22 10:14:30",
    status: "Success"
  },
  {
    id: "LOG-9004",
    user: "Prakash Kumar Nayak (Loan Officer)",
    action: "LOAN_APPROVED",
    module: "Loans",
    description: "Sanctioned Vehicle Loan LN10024 for ₹8,50,000",
    ipAddress: "192.168.1.115",
    dateTime: "2026-09-22 09:50:22",
    status: "Success"
  },
  {
    id: "LOG-9005",
    user: "Unknown / External",
    action: "LOGIN",
    module: "Auth",
    description: "Failed login attempt for user 'admin_backup' - Invalid credentials",
    ipAddress: "203.192.241.88",
    dateTime: "2026-09-22 08:34:10",
    status: "Failed"
  },
  {
    id: "LOG-9006",
    user: "Debashis Mohanty (Accountant)",
    action: "REPORT_EXPORTED",
    module: "Reports",
    description: "Exported Monthly Collection Excel summary report for August 2026",
    ipAddress: "192.168.1.109",
    dateTime: "2026-09-21 17:45:00",
    status: "Success"
  },
  {
    id: "LOG-9007",
    user: "Ashok Kumar Jena (KYC Officer)",
    action: "KYC_REJECTED",
    module: "KYC",
    description: "Rejected KYC verification for Member M1005 due to blurry ID proof",
    ipAddress: "192.168.1.112",
    dateTime: "2026-09-21 15:20:10",
    status: "Warning"
  },
  {
    id: "LOG-9008",
    user: "Swati Sucharita (Manager)",
    action: "ACCOUNT_UPDATED",
    module: "Savings",
    description: "Froze account SB100205 due to KYC rejection",
    ipAddress: "192.168.1.108",
    dateTime: "2026-09-21 15:25:00",
    status: "Success"
  },
  // Additional batch for 50+ audit logs
  ...Array.from({ length: 44 }, (_, i) => {
    const idx = i + 9;
    const actions = [
      { a: "LOGIN", m: "Auth", d: "User session authenticated", s: "Success" },
      { a: "MEMBER_CREATED", m: "Members", d: `Created new member profile M10${10 + (i % 20)}`, s: "Success" },
      { a: "ACCOUNT_CREATED", m: "Savings", d: `Opened new Savings Account SB1002${10 + (i % 20)}`, s: "Success" },
      { a: "DEPOSIT", m: "Cashier", d: "Cash drawer collection receipt generated", s: "Success" },
      { a: "WITHDRAWAL", m: "Savings", d: "Processed counter withdrawal request", s: "Success" },
      { a: "LOAN_APPROVED", m: "Loans", d: "Loan application moved to disbursed status", s: "Success" },
      { a: "REPORT_EXPORTED", m: "Reports", d: "Audit ledger PDF exported", s: "Success" },
      { a: "LOGIN", m: "Auth", d: "Multiple failed attempts from IP", s: "Failed" }
    ];
    const item = actions[i % actions.length];
    const day = 21 - Math.floor(i / 3);
    const dateStr = `2026-09-${String(day > 0 ? day : 1).padStart(2, '0')} ${String(10 + (i % 8)).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}:12`;
    
    return {
      id: `LOG-90${String(idx).padStart(2, '0')}`,
      user: item.s === "Failed" ? "External Host" : "Staff User",
      action: item.a,
      module: item.m,
      description: item.d,
      ipAddress: item.s === "Failed" ? `103.21.${i % 50}.112` : `192.168.1.${100 + (i % 30)}`,
      dateTime: dateStr,
      status: item.s
    };
  })
];
