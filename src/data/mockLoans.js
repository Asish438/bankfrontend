export const mockLoans = [
  {
    loanId: "LN10021",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    mobile: "9861023451",
    loanType: "Personal Loan",
    requestedAmount: 300000,
    approvedAmount: 300000,
    interestRate: 11.5,
    tenureMonths: 24,
    emiAmount: 14050,
    outstandingAmount: 112400,
    disbursementDate: "2024-05-10",
    status: "Active",
    purpose: "Home Renovation",
    branch: "Bhubaneswar Main",
    repaymentMode: "Auto-Debit (SB100201)",
    guarantor: "Sunita Mohapatra",
    schedule: [
      { emiNo: 1, dueDate: "2024-06-10", principal: 11175, interest: 2875, emiAmount: 14050, paidAmount: 14050, status: "Paid", paidDate: "2024-06-08" },
      { emiNo: 2, dueDate: "2024-07-10", principal: 11282, interest: 2768, emiAmount: 14050, paidAmount: 14050, status: "Paid", paidDate: "2024-07-09" },
      { emiNo: 3, dueDate: "2024-08-10", principal: 11390, interest: 2660, emiAmount: 14050, paidAmount: 14050, status: "Paid", paidDate: "2024-08-10" },
      { emiNo: 4, dueDate: "2024-09-10", principal: 11499, interest: 2551, emiAmount: 14050, paidAmount: 14050, status: "Paid", paidDate: "2024-09-10" }
    ]
  },
  {
    loanId: "LN10022",
    memberId: "M1003",
    memberName: "Amit Prasad Das",
    mobile: "9937088991",
    loanType: "Business Loan",
    requestedAmount: 1500000,
    approvedAmount: 1500000,
    interestRate: 12.0,
    tenureMonths: 48,
    emiAmount: 39510,
    outstandingAmount: 890000,
    disbursementDate: "2023-08-15",
    status: "Active",
    purpose: "Resort Expansion & Kitchen Setup",
    branch: "Puri Beach Road",
    repaymentMode: "UPI / Bank Transfer",
    guarantor: "Geeta Das",
    schedule: [
      { emiNo: 1, dueDate: "2023-09-15", principal: 24510, interest: 15000, emiAmount: 39510, paidAmount: 39510, status: "Paid", paidDate: "2023-09-14" },
      { emiNo: 2, dueDate: "2023-10-15", principal: 24755, interest: 14755, emiAmount: 39510, paidAmount: 39510, status: "Paid", paidDate: "2023-10-15" }
    ]
  },
  {
    loanId: "LN10023",
    memberId: "M1004",
    memberName: "Sneha Patra",
    mobile: "8895023910",
    loanType: "Gold Loan",
    requestedAmount: 200000,
    approvedAmount: 180000,
    interestRate: 9.5,
    tenureMonths: 12,
    emiAmount: 15780,
    outstandingAmount: 0,
    disbursementDate: "2025-02-01",
    status: "Completed",
    purpose: "Immediate Medical Emergency",
    branch: "Rourkela Main",
    repaymentMode: "Cashier Counter",
    guarantor: "Subrat Patra",
    schedule: [
      { emiNo: 1, dueDate: "2025-03-01", principal: 14355, interest: 1425, emiAmount: 15780, paidAmount: 15780, status: "Paid", paidDate: "2025-03-01" }
    ]
  },
  {
    loanId: "LN10024",
    memberId: "M1006",
    memberName: "Deepak Chandra Swain",
    mobile: "9337198234",
    loanType: "Vehicle Loan",
    requestedAmount: 850000,
    approvedAmount: 850000,
    interestRate: 10.2,
    tenureMonths: 36,
    emiAmount: 27500,
    outstandingAmount: 512000,
    disbursementDate: "2024-01-20",
    status: "Active",
    purpose: "Commercial Pickup Van",
    branch: "Bhubaneswar Main",
    repaymentMode: "Auto-Debit",
    guarantor: "Rashmi Swain",
    schedule: [
      { emiNo: 1, dueDate: "2024-02-20", principal: 20275, interest: 7225, emiAmount: 27500, paidAmount: 27500, status: "Paid", paidDate: "2024-02-19" }
    ]
  },
  {
    loanId: "LN10025",
    memberId: "M1008",
    memberName: "Manoj Kumar Rout",
    mobile: "9438091278",
    loanType: "Agricultural Loan",
    requestedAmount: 400000,
    approvedAmount: 350000,
    interestRate: 7.0,
    tenureMonths: 24,
    emiAmount: 15660,
    outstandingAmount: 320000,
    disbursementDate: "2025-09-01",
    status: "Overdue",
    purpose: "Dairy Equipment & Tractor Implements",
    branch: "Cuttack Central",
    repaymentMode: "Cash",
    guarantor: "Minati Rout",
    schedule: [
      { emiNo: 1, dueDate: "2025-10-01", principal: 13618, interest: 2042, emiAmount: 15660, paidAmount: 15660, status: "Paid", paidDate: "2025-10-01" },
      { emiNo: 2, dueDate: "2026-09-01", principal: 13697, interest: 1963, emiAmount: 15660, paidAmount: 0, status: "Overdue", paidDate: "-" }
    ]
  },
  {
    loanId: "LN10026",
    memberId: "M1002",
    memberName: "Priya Sharma",
    mobile: "9437011223",
    loanType: "Personal Loan",
    requestedAmount: 150000,
    approvedAmount: 0,
    interestRate: 11.5,
    tenureMonths: 18,
    emiAmount: 9110,
    outstandingAmount: 0,
    disbursementDate: "-",
    status: "Pending",
    purpose: "Higher Education Certification",
    branch: "Cuttack Central",
    repaymentMode: "Auto-Debit",
    guarantor: "Ramesh Sharma",
    schedule: []
  },
  // Additional batch for 22 loan records
  ...Array.from({ length: 16 }, (_, i) => {
    const idx = i + 7;
    const types = ["Personal Loan", "Business Loan", "Agricultural Loan", "Gold Loan", "Home Loan"];
    const statuses = ["Active", "Active", "Pending", "Under Review", "Approved", "Completed", "Overdue", "Rejected"];
    const stat = statuses[i % statuses.length];
    const type = types[i % types.length];
    const amt = [150000, 300000, 500000, 800000, 1200000][i % 5];
    const tenure = [12, 24, 36, 48][i % 4];
    const rate = type === "Agricultural Loan" ? 7.0 : (type === "Gold Loan" ? 9.0 : 11.5);
    const emi = Math.round((amt / tenure) + (amt * (rate / 100 / 12)));
    
    return {
      loanId: `LN100${String(idx).padStart(2, '0')}`,
      memberId: `M10${idx}`,
      memberName: `Loan Applicant ${idx}`,
      mobile: `9861${400000 + idx * 47}`,
      loanType: type,
      requestedAmount: amt,
      approvedAmount: stat === "Rejected" ? 0 : amt,
      interestRate: rate,
      tenureMonths: tenure,
      emiAmount: emi,
      outstandingAmount: stat === "Active" || stat === "Overdue" ? Math.round(amt * 0.7) : 0,
      disbursementDate: stat === "Active" || stat === "Completed" ? `2024-0${(i % 9) + 1}-10` : "-",
      status: stat,
      purpose: `${type} for expansion and working capital requirement`,
      branch: i % 2 === 0 ? "Bhubaneswar Main" : "Cuttack Central",
      repaymentMode: "Auto-Debit",
      guarantor: `Guarantor of Member ${idx}`,
      schedule: []
    };
  })
];
