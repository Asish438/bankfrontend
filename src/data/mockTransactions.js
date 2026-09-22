export const mockTransactions = [
  {
    id: "TXN90281",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    accountNumber: "SB100201",
    type: "Deposit",
    category: "Savings",
    amount: 25000,
    paymentMode: "UPI",
    referenceNo: "UPI/38291047192",
    date: "2026-09-22 10:14:30",
    status: "Success",
    previousBalance: 120820,
    newBalance: 145820,
    description: "Funds received via PhonePe UPI"
  },
  {
    id: "TXN90280",
    memberId: "M1003",
    memberName: "Amit Prasad Das",
    accountNumber: "SB100203",
    type: "Withdrawal",
    category: "Savings",
    amount: 50000,
    paymentMode: "Cash",
    referenceNo: "CHQ-778102",
    date: "2026-09-22 09:45:12",
    status: "Success",
    previousBalance: 570400,
    newBalance: 520400,
    description: "Cheque withdrawal at counter"
  },
  {
    id: "TXN90279",
    memberId: "M1004",
    memberName: "Sneha Patra",
    accountNumber: "RD8803",
    type: "RD Installment",
    category: "Recurring Deposit",
    amount: 3000,
    paymentMode: "Bank Transfer",
    referenceNo: "NEFT/N9021389",
    date: "2026-09-21 16:30:00",
    status: "Success",
    previousBalance: 21000,
    newBalance: 24000,
    description: "Monthly RD Installment #8"
  },
  {
    id: "TXN90278",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    accountNumber: "LN10021",
    type: "Loan EMI",
    category: "Loan Repayment",
    amount: 14050,
    paymentMode: "Bank Transfer",
    referenceNo: "ACH/DEBIT-891",
    date: "2026-09-21 14:12:44",
    status: "Success",
    previousBalance: 126450,
    newBalance: 112400,
    description: "Auto-Debit Loan EMI month 16"
  },
  {
    id: "TXN90277",
    memberId: "M1006",
    memberName: "Deepak Chandra Swain",
    accountNumber: "SB100206",
    type: "Deposit",
    category: "Savings",
    amount: 100000,
    paymentMode: "Cash",
    referenceNo: "CSH-99201",
    date: "2026-09-21 11:05:18",
    status: "Success",
    previousBalance: 212900,
    newBalance: 312900,
    description: "Cash deposit by account holder"
  },
  {
    id: "TXN90276",
    memberId: "M1007",
    memberName: "Ananya Tripathy",
    accountNumber: "FD10024",
    type: "FD Deposit",
    category: "Fixed Deposit",
    amount: 150000,
    paymentMode: "UPI",
    referenceNo: "UPI/9812039128",
    date: "2026-09-20 15:40:02",
    status: "Success",
    previousBalance: 0,
    newBalance: 150000,
    description: "FD Principal Creation"
  },
  {
    id: "TXN90275",
    memberId: "M1008",
    memberName: "Manoj Kumar Rout",
    accountNumber: "SB100208",
    type: "Deposit",
    category: "Savings",
    amount: 15000,
    paymentMode: "Cash",
    referenceNo: "CSH-99182",
    date: "2026-09-20 12:20:10",
    status: "Success",
    previousBalance: 27000,
    newBalance: 42000,
    description: "Cashier counter cash deposit"
  },
  {
    id: "TXN90274",
    memberId: "M1009",
    memberName: "Sunita Rani Sahu",
    accountNumber: "SB100209",
    type: "Deposit",
    category: "Savings",
    amount: 8500,
    paymentMode: "UPI",
    referenceNo: "UPI/3910283011",
    date: "2026-09-19 17:15:30",
    status: "Success",
    previousBalance: 88300,
    newBalance: 96800,
    description: "UPI QR Payment credit"
  },
  // Additional batch for 50+ transactions
  ...Array.from({ length: 44 }, (_, i) => {
    const idx = i + 10;
    const types = ["Deposit", "Withdrawal", "RD Installment", "Loan EMI", "Transfer", "Interest"];
    const modes = ["Cash", "UPI", "Bank Transfer"];
    const type = types[i % types.length];
    const mode = modes[i % modes.length];
    const amounts = [2000, 5000, 10000, 15000, 25000, 50000, 1200, 7500];
    const amt = amounts[i % amounts.length];
    const day = 20 - Math.floor(i / 3);
    const dateStr = `2026-09-${String(day > 0 ? day : 1).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`;
    
    return {
      id: `TXN902${String(74 - i).padStart(2, '0')}`,
      memberId: `M10${(i % 15) + 1}`,
      memberName: `Member ${(i % 15) + 1} Name`,
      accountNumber: `SB1002${(i % 15) + 1}`,
      type: type,
      category: type.includes("Loan") ? "Loan Repayment" : (type.includes("RD") ? "Recurring Deposit" : "Savings"),
      amount: amt,
      paymentMode: mode,
      referenceNo: mode === "UPI" ? `UPI/98120${i}8` : (mode === "Cash" ? `CSH-${88100 + i}` : `RTGS/N${10000 + i}`),
      date: dateStr,
      status: "Success",
      previousBalance: amt * 3,
      newBalance: type === "Withdrawal" ? amt * 2 : amt * 4,
      description: `${type} processed via ${mode}`
    };
  })
];
