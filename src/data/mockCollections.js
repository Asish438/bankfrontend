export const mockCollections = [
  {
    id: "COL8901",
    receiptNo: "RCP-2026-09-001",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    collectionType: "Savings Deposit",
    amount: 25000,
    paymentMode: "UPI",
    collectedBy: "Subhashree Panda (Cashier)",
    date: "2026-09-22 10:14:30",
    status: "Completed",
    branch: "Bhubaneswar Main",
    remarks: "QR counter collection"
  },
  {
    id: "COL8902",
    receiptNo: "RCP-2026-09-002",
    memberId: "M1006",
    memberName: "Deepak Chandra Swain",
    collectionType: "Savings Deposit",
    amount: 100000,
    paymentMode: "Cash",
    collectedBy: "Subhashree Panda (Cashier)",
    date: "2026-09-21 11:05:18",
    status: "Completed",
    branch: "Bhubaneswar Main",
    remarks: "Direct cash drawer entry"
  },
  {
    id: "COL8903",
    receiptNo: "RCP-2026-09-003",
    memberId: "M1004",
    memberName: "Sneha Patra",
    collectionType: "RD Installment",
    amount: 3000,
    paymentMode: "Bank Transfer",
    collectedBy: "Subhashree Panda (Cashier)",
    date: "2026-09-21 16:30:00",
    status: "Completed",
    branch: "Rourkela Main",
    remarks: "Direct bank transfer credited"
  },
  {
    id: "COL8904",
    receiptNo: "RCP-2026-09-004",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    collectionType: "Loan EMI",
    amount: 14050,
    paymentMode: "Bank Transfer",
    collectedBy: "Prakash Nayak (Loan Officer)",
    date: "2026-09-21 14:12:44",
    status: "Completed",
    branch: "Bhubaneswar Main",
    remarks: "Loan EMI installment #16"
  },
  {
    id: "COL8905",
    receiptNo: "RCP-2026-09-005",
    memberId: "M1007",
    memberName: "Ananya Tripathy",
    collectionType: "FD Deposit",
    amount: 150000,
    paymentMode: "UPI",
    collectedBy: "Subhashree Panda (Cashier)",
    date: "2026-09-20 15:40:02",
    status: "Completed",
    branch: "Cuttack Central",
    remarks: "New FD certificate creation deposit"
  },
  // Additional batch for 22+ collection logs
  ...Array.from({ length: 18 }, (_, i) => {
    const idx = i + 6;
    const types = ["Savings Deposit", "RD Installment", "Loan EMI", "FD Deposit", "Other Fee"];
    const modes = ["Cash", "UPI", "Bank Transfer"];
    const type = types[i % types.length];
    const mode = modes[i % modes.length];
    const amounts = [5000, 10000, 15000, 20000, 50000, 2500];
    const amt = amounts[i % amounts.length];
    return {
      id: `COL89${String(idx).padStart(2, '0')}`,
      receiptNo: `RCP-2026-09-0${String(idx).padStart(2, '0')}`,
      memberId: `M10${(i % 12) + 1}`,
      memberName: `Customer Member ${(i % 12) + 1}`,
      collectionType: type,
      amount: amt,
      paymentMode: mode,
      collectedBy: i % 2 === 0 ? "Subhashree Panda (Cashier)" : "Prakash Nayak (Loan Officer)",
      date: `2026-09-${String(20 - Math.floor(i / 2)).padStart(2, '0')} 11:30:00`,
      status: "Completed",
      branch: i % 2 === 0 ? "Bhubaneswar Main" : "Cuttack Central",
      remarks: `Collection for ${type}`
    };
  })
];
