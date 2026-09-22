export const mockNotifications = [
  {
    id: "NOTIF-1",
    title: "KYC Verification Pending",
    description: "KYC verification pending for Member Priya Sharma (M1002)",
    time: "10 mins ago",
    type: "kyc",
    read: false,
    link: "/kyc"
  },
  {
    id: "NOTIF-2",
    title: "Loan Overdue Alert",
    description: "Agricultural Loan LN10025 for Manoj Kumar Rout is overdue by 21 days",
    time: "45 mins ago",
    type: "loan",
    read: false,
    link: "/loans/LN10025"
  },
  {
    id: "NOTIF-3",
    title: "FD Maturing Soon",
    description: "Fixed Deposit FD10021 (₹2,54,800) is maturing in 7 days",
    time: "2 hours ago",
    type: "fd",
    read: false,
    link: "/fd"
  },
  {
    id: "NOTIF-4",
    title: "New Member Registered",
    description: "Member Deepak Chandra Swain (M1006) profile created successfully",
    time: "5 hours ago",
    type: "member",
    read: true,
    link: "/members/M1006"
  },
  {
    id: "NOTIF-5",
    title: "High Value Cash Deposit",
    description: "₹1,00,000 cash deposited to Account SB100206 by Cashier counter",
    time: "1 day ago",
    type: "cashier",
    read: true,
    link: "/collections"
  }
];
