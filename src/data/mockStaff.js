export const mockStaff = [
  {
    id: "STF101",
    name: "Manas Ranjan Mishra",
    email: "manas.mishra@bankadmin.coop",
    mobile: "9861001122",
    role: "Super Admin",
    status: "Active",
    branch: "Head Office (Bhubaneswar)",
    lastLogin: "2026-09-22 11:20:15",
    joinDate: "2020-04-01",
    department: "Executive Board"
  },
  {
    id: "STF102",
    name: "Swati Sucharita",
    email: "swati.sucharita@bankadmin.coop",
    mobile: "9437002233",
    role: "Manager",
    status: "Active",
    branch: "Bhubaneswar Main",
    lastLogin: "2026-09-22 10:45:00",
    joinDate: "2021-06-15",
    department: "Branch Operations"
  },
  {
    id: "STF103",
    name: "Debashis Mohanty",
    email: "debashis.mohanty@bankadmin.coop",
    mobile: "9937003344",
    role: "Accountant",
    status: "Active",
    branch: "Head Office (Bhubaneswar)",
    lastLogin: "2026-09-22 09:30:12",
    joinDate: "2021-08-01",
    department: "Accounts & Audit"
  },
  {
    id: "STF104",
    name: "Subhashree Panda",
    email: "subhashree.panda@bankadmin.coop",
    mobile: "8895004455",
    role: "Cashier",
    status: "Active",
    branch: "Bhubaneswar Main",
    lastLogin: "2026-09-22 11:15:33",
    joinDate: "2022-01-10",
    department: "Counter Operations"
  },
  {
    id: "STF105",
    name: "Prakash Kumar Nayak",
    email: "prakash.nayak@bankadmin.coop",
    mobile: "9778005566",
    role: "Loan Officer",
    status: "Active",
    branch: "Bhubaneswar Main",
    lastLogin: "2026-09-22 10:10:45",
    joinDate: "2022-03-20",
    department: "Credit & Appraisals"
  },
  {
    id: "STF106",
    name: "Ashok Kumar Jena",
    email: "ashok.jena@bankadmin.coop",
    mobile: "9337006677",
    role: "KYC Officer",
    status: "Active",
    branch: "Bhubaneswar Main",
    lastLogin: "2026-09-22 11:00:20",
    joinDate: "2022-05-15",
    department: "Compliance & KYC"
  },
  {
    id: "STF107",
    name: "Suresh Chandra Das",
    email: "suresh.das@bankadmin.coop",
    mobile: "9178007788",
    role: "Manager",
    status: "Active",
    branch: "Cuttack Central",
    lastLogin: "2026-09-21 17:15:00",
    joinDate: "2021-09-01",
    department: "Branch Operations"
  },
  {
    id: "STF108",
    name: "Tanmayee Samal",
    email: "tanmayee.samal@bankadmin.coop",
    mobile: "9438008899",
    role: "Cashier",
    status: "Active",
    branch: "Cuttack Central",
    lastLogin: "2026-09-22 09:15:00",
    joinDate: "2023-02-14",
    department: "Counter Operations"
  },
  {
    id: "STF109",
    name: "Rajesh Behera",
    email: "rajesh.behera@bankadmin.coop",
    mobile: "9853009900",
    role: "Loan Officer",
    status: "Active",
    branch: "Cuttack Central",
    lastLogin: "2026-09-21 16:40:12",
    joinDate: "2023-04-10",
    department: "Credit & Appraisals"
  },
  {
    id: "STF110",
    name: "Jyotirmayee Sutar",
    email: "jyotirmayee.sutar@bankadmin.coop",
    mobile: "9439001199",
    role: "Admin",
    status: "Inactive",
    branch: "Puri Beach Road",
    lastLogin: "2026-08-25 14:00:00",
    joinDate: "2022-11-01",
    department: "Branch Operations"
  },
  // Additional batch for 22 staff members
  ...Array.from({ length: 12 }, (_, i) => {
    const idx = i + 11;
    const roles = ["Loan Officer", "Cashier", "KYC Officer", "Accountant", "Manager", "Admin"];
    const branches = ["Puri Beach Road", "Rourkela Main", "Sambalpur City", "Balasore North"];
    const names = ["Aditya", "Smruti", "Biswajit", "Aliva", "Tushar", "Gitanjali", "Jayant", "Mousumi"];
    const role = roles[i % roles.length];
    const name = `${names[i % names.length]} ${["Pradhan", "Rath", "Mahapatra", "Sahoo", "Baral"][i % 5]}`;
    return {
      id: `STF${100 + idx}`,
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@bankadmin.coop`,
      mobile: `9861${600000 + idx * 37}`,
      role: role,
      status: i === 5 ? "Inactive" : "Active",
      branch: branches[i % branches.length],
      lastLogin: `2026-09-${20 - (i % 5)} 10:00:00`,
      joinDate: `2023-0${(i % 9) + 1}-15`,
      department: role === "Loan Officer" ? "Credit" : (role === "Cashier" ? "Counter" : "Operations")
    };
  })
];
