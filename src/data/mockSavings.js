export const mockSavings = [
  {
    accountNumber: "SB100201",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    mobile: "9861023451",
    openingDate: "2023-01-20",
    balance: 145820,
    interestRate: 4.5,
    status: "Active",
    branch: "Bhubaneswar Main",
    nominee: "Sunita Mohapatra",
    lastTransactionDate: "2026-09-21"
  },
  {
    accountNumber: "SB100202",
    memberId: "M1002",
    memberName: "Priya Sharma",
    mobile: "9437011223",
    openingDate: "2026-09-20",
    balance: 25000,
    interestRate: 4.5,
    status: "Active",
    branch: "Cuttack Central",
    nominee: "Ramesh Sharma",
    lastTransactionDate: "2026-09-20"
  },
  {
    accountNumber: "SB100203",
    memberId: "M1003",
    memberName: "Amit Prasad Das",
    mobile: "9937088991",
    openingDate: "2023-04-15",
    balance: 520400,
    interestRate: 4.5,
    status: "Active",
    branch: "Puri Beach Road",
    nominee: "Geeta Das",
    lastTransactionDate: "2026-09-22"
  },
  {
    accountNumber: "SB100204",
    memberId: "M1004",
    memberName: "Sneha Patra",
    mobile: "8895023910",
    openingDate: "2023-06-25",
    balance: 87400,
    interestRate: 4.5,
    status: "Active",
    branch: "Rourkela Main",
    nominee: "Subrat Patra",
    lastTransactionDate: "2026-09-19"
  },
  {
    accountNumber: "SB100205",
    memberId: "M1005",
    memberName: "Rohit Kumar Mehta",
    mobile: "9778045129",
    openingDate: "2026-08-16",
    balance: 5000,
    interestRate: 4.5,
    status: "Frozen",
    branch: "Sambalpur City",
    nominee: "Pooja Mehta",
    lastTransactionDate: "2026-08-16"
  },
  {
    accountNumber: "SB100206",
    memberId: "M1006",
    memberName: "Deepak Chandra Swain",
    mobile: "9337198234",
    openingDate: "2022-11-10",
    balance: 312900,
    interestRate: 4.5,
    status: "Active",
    branch: "Bhubaneswar Main",
    nominee: "Rashmi Swain",
    lastTransactionDate: "2026-09-21"
  },
  {
    accountNumber: "SB100207",
    memberId: "M1007",
    memberName: "Ananya Tripathy",
    mobile: "9178054321",
    openingDate: "2024-02-20",
    balance: 189350,
    interestRate: 4.5,
    status: "Active",
    branch: "Cuttack Central",
    nominee: "Sudhanshu Tripathy",
    lastTransactionDate: "2026-09-15"
  },
  {
    accountNumber: "SB100208",
    memberId: "M1008",
    memberName: "Manoj Kumar Rout",
    mobile: "9438091278",
    openingDate: "2026-09-15",
    balance: 42000,
    interestRate: 4.5,
    status: "Active",
    branch: "Cuttack Central",
    nominee: "Minati Rout",
    lastTransactionDate: "2026-09-15"
  },
  {
    accountNumber: "SB100209",
    memberId: "M1009",
    memberName: "Sunita Rani Sahu",
    mobile: "9853019482",
    openingDate: "2023-08-15",
    balance: 96800,
    interestRate: 4.5,
    status: "Active",
    branch: "Puri Beach Road",
    nominee: "Binod Sahu",
    lastTransactionDate: "2026-09-18"
  },
  {
    accountNumber: "SB100210",
    memberId: "M1010",
    memberName: "Bikash Ranjan Nayek",
    mobile: "9439088123",
    openingDate: "2024-05-15",
    balance: 245000,
    interestRate: 4.5,
    status: "Active",
    branch: "Balasore North",
    nominee: "Alok Nayek",
    lastTransactionDate: "2026-09-12"
  },
  // Additional batch for 30+ accounts
  ...Array.from({ length: 22 }, (_, i) => {
    const idx = i + 11;
    const balances = [34000, 112000, 89000, 450000, 16000, 78200, 230000, 95000];
    const statuses = ["Active", "Active", "Active", "Active", "Frozen", "Closed"];
    return {
      accountNumber: `SB1002${idx}`,
      memberId: `M10${idx}`,
      memberName: `Member ${idx} Account Holder`,
      mobile: `9861${100000 + idx * 77}`,
      openingDate: `2024-0${(i % 9) + 1}-10`,
      balance: balances[i % balances.length],
      interestRate: 4.5,
      status: statuses[i % statuses.length],
      branch: i % 2 === 0 ? "Bhubaneswar Main" : "Cuttack Central",
      nominee: `Nominee of Member ${idx}`,
      lastTransactionDate: `2026-09-${10 + (i % 12)}`
    };
  })
];
