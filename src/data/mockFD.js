export const mockFD = [
  {
    fdNumber: "FD10021",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    mobile: "9861023451",
    principalAmount: 200000,
    interestRate: 8.25,
    tenureMonths: 36,
    startDate: "2023-10-01",
    maturityDate: "2026-10-01",
    maturityAmount: 254800,
    status: "Maturing Soon",
    branch: "Bhubaneswar Main",
    autoRenew: true
  },
  {
    fdNumber: "FD10022",
    memberId: "M1003",
    memberName: "Amit Prasad Das",
    mobile: "9937088991",
    principalAmount: 1000000,
    interestRate: 8.5,
    tenureMonths: 60,
    startDate: "2022-04-10",
    maturityDate: "2027-04-10",
    maturityAmount: 1520000,
    status: "Active",
    branch: "Puri Beach Road",
    autoRenew: false
  },
  {
    fdNumber: "FD10023",
    memberId: "M1006",
    memberName: "Deepak Chandra Swain",
    mobile: "9337198234",
    principalAmount: 500000,
    interestRate: 8.25,
    tenureMonths: 24,
    startDate: "2024-03-15",
    maturityDate: "2026-03-15",
    maturityAmount: 588500,
    status: "Matured",
    branch: "Bhubaneswar Main",
    autoRenew: true
  },
  {
    fdNumber: "FD10024",
    memberId: "M1007",
    memberName: "Ananya Tripathy",
    mobile: "9178054321",
    principalAmount: 150000,
    interestRate: 8.0,
    tenureMonths: 12,
    startDate: "2025-11-20",
    maturityDate: "2026-11-20",
    maturityAmount: 162400,
    status: "Active",
    branch: "Cuttack Central",
    autoRenew: true
  },
  {
    fdNumber: "FD10025",
    memberId: "M1010",
    memberName: "Bikash Ranjan Nayek",
    mobile: "9439088123",
    principalAmount: 300000,
    interestRate: 8.25,
    tenureMonths: 36,
    startDate: "2024-06-01",
    maturityDate: "2027-06-01",
    maturityAmount: 382200,
    status: "Active",
    branch: "Balasore North",
    autoRenew: false
  },
  // Additional batch for 22 FD accounts
  ...Array.from({ length: 17 }, (_, i) => {
    const idx = i + 6;
    const principals = [100000, 250000, 500000, 750000, 1000000, 150000];
    const statuses = ["Active", "Active", "Maturing Soon", "Matured", "Closed"];
    const stat = statuses[i % statuses.length];
    const principal = principals[i % principals.length];
    return {
      fdNumber: `FD1002${idx}`,
      memberId: `M10${idx}`,
      memberName: `FD Holder ${idx}`,
      mobile: `9861${300000 + idx * 61}`,
      principalAmount: principal,
      interestRate: 8.25,
      tenureMonths: 36,
      startDate: `2024-0${(i % 9) + 1}-15`,
      maturityDate: stat === "Maturing Soon" ? "2026-09-29" : `2027-0${(i % 9) + 1}-15`,
      maturityAmount: Math.round(principal * 1.27),
      status: stat,
      branch: i % 2 === 0 ? "Bhubaneswar Main" : "Cuttack Central",
      autoRenew: i % 2 === 0
    };
  })
];
