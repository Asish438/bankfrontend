export const mockRD = [
  {
    rdNumber: "RD8801",
    memberId: "M1001",
    memberName: "Rahul Kumar Mohapatra",
    mobile: "9861023451",
    installmentAmount: 5000,
    frequency: "Monthly",
    tenureMonths: 24,
    interestRate: 7.2,
    startDate: "2024-02-01",
    maturityDate: "2026-02-01",
    maturityAmount: 130120,
    paidInstallments: 20,
    totalInstallments: 24,
    status: "Active",
    branch: "Bhubaneswar Main"
  },
  {
    rdNumber: "RD8802",
    memberId: "M1003",
    memberName: "Amit Prasad Das",
    mobile: "9937088991",
    installmentAmount: 10000,
    frequency: "Monthly",
    tenureMonths: 36,
    interestRate: 7.5,
    startDate: "2023-05-01",
    maturityDate: "2026-05-01",
    maturityAmount: 405800,
    paidInstallments: 36,
    totalInstallments: 36,
    status: "Matured",
    branch: "Puri Beach Road"
  },
  {
    rdNumber: "RD8803",
    memberId: "M1004",
    memberName: "Sneha Patra",
    mobile: "8895023910",
    installmentAmount: 3000,
    frequency: "Monthly",
    tenureMonths: 12,
    interestRate: 6.8,
    startDate: "2026-01-15",
    maturityDate: "2027-01-15",
    maturityAmount: 37450,
    paidInstallments: 8,
    totalInstallments: 12,
    status: "Active",
    branch: "Rourkela Main"
  },
  {
    rdNumber: "RD8804",
    memberId: "M1006",
    memberName: "Deepak Chandra Swain",
    mobile: "9337198234",
    installmentAmount: 15000,
    frequency: "Monthly",
    tenureMonths: 24,
    interestRate: 7.2,
    startDate: "2025-06-01",
    maturityDate: "2027-06-01",
    maturityAmount: 390400,
    paidInstallments: 15,
    totalInstallments: 24,
    status: "Active",
    branch: "Bhubaneswar Main"
  },
  {
    rdNumber: "RD8805",
    memberId: "M1007",
    memberName: "Ananya Tripathy",
    mobile: "9178054321",
    installmentAmount: 2000,
    frequency: "Monthly",
    tenureMonths: 12,
    interestRate: 6.8,
    startDate: "2026-08-01",
    maturityDate: "2027-08-01",
    maturityAmount: 24980,
    paidInstallments: 1,
    totalInstallments: 12,
    status: "Pending",
    branch: "Cuttack Central"
  },
  // Additional batch for 24 RD accounts
  ...Array.from({ length: 19 }, (_, i) => {
    const idx = i + 6;
    const installments = [2000, 3000, 5000, 10000, 15000];
    const statuses = ["Active", "Active", "Active", "Pending", "Matured", "Closed"];
    const stat = statuses[i % statuses.length];
    const amt = installments[i % installments.length];
    return {
      rdNumber: `RD88${String(idx).padStart(2, '0')}`,
      memberId: `M10${idx}`,
      memberName: `RD Holder ${idx}`,
      mobile: `9861${200000 + idx * 83}`,
      installmentAmount: amt,
      frequency: "Monthly",
      tenureMonths: 24,
      interestRate: 7.2,
      startDate: `2024-0${(i % 9) + 1}-01`,
      maturityDate: `2026-0${(i % 9) + 1}-01`,
      maturityAmount: Math.round(amt * 24 * 1.08),
      paidInstallments: stat === "Matured" ? 24 : 10 + (i % 12),
      totalInstallments: 24,
      status: stat,
      branch: i % 2 === 0 ? "Bhubaneswar Main" : "Cuttack Central"
    };
  })
];
