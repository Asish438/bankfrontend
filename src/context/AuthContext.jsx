import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  ACCOUNTANT: 'Accountant',
  CASHIER: 'Cashier',
  LOAN_OFFICER: 'Loan Officer',
  KYC_OFFICER: 'KYC Officer'
};

// Default role permissions matrix
export const ROLE_PERMISSIONS = {
  'Super Admin': {
    all: true
  },
  'Manager': {
    Dashboard: ['View', 'Export'],
    Members: ['View', 'Create', 'Edit', 'Export'],
    KYC: ['View', 'Approve', 'Export'],
    Savings: ['View', 'Create', 'Edit', 'Export'],
    RD: ['View', 'Create', 'Export'],
    FD: ['View', 'Create', 'Export'],
    Loans: ['View', 'Create', 'Approve', 'Export'],
    Collection: ['View', 'Export'],
    Accounting: ['View', 'Export'],
    Reports: ['View', 'Export'],
    Staff: ['View'],
    Security: ['View'],
    Settings: ['View', 'Edit']
  },
  'Accountant': {
    Dashboard: ['View'],
    Members: ['View'],
    Savings: ['View', 'Export'],
    RD: ['View', 'Export'],
    FD: ['View', 'Export'],
    Loans: ['View', 'Export'],
    Collection: ['View', 'Export'],
    Accounting: ['View', 'Create', 'Edit', 'Export'],
    Reports: ['View', 'Export'],
    Security: ['View']
  },
  'Cashier': {
    Dashboard: ['View'],
    Members: ['View'],
    Savings: ['View', 'Create'],
    RD: ['View', 'Create'],
    FD: ['View', 'Create'],
    Loans: ['View'],
    Collection: ['View', 'Create', 'Export'],
    Reports: ['View']
  },
  'Loan Officer': {
    Dashboard: ['View'],
    Members: ['View', 'Create'],
    Savings: ['View'],
    RD: ['View'],
    FD: ['View'],
    Loans: ['View', 'Create', 'Edit', 'Approve', 'Export'],
    Reports: ['View', 'Export']
  },
  'KYC Officer': {
    Dashboard: ['View'],
    Members: ['View', 'Edit'],
    KYC: ['View', 'Approve', 'Edit', 'Export'],
    Savings: ['View'],
    RD: ['View'],
    FD: ['View'],
    Loans: ['View'],
    Reports: ['View']
  },
  'Admin': {
    Dashboard: ['View', 'Export'],
    Members: ['View', 'Create', 'Edit', 'Export'],
    KYC: ['View', 'Approve', 'Export'],
    Savings: ['View', 'Create', 'Edit', 'Export'],
    RD: ['View', 'Create', 'Export'],
    FD: ['View', 'Create', 'Export'],
    Loans: ['View', 'Create', 'Approve', 'Export'],
    Collection: ['View', 'Export'],
    Accounting: ['View', 'Export'],
    Reports: ['View', 'Export'],
    Staff: ['View', 'Create', 'Edit'],
    Security: ['View', 'Export'],
    Settings: ['View', 'Edit']
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: "STF101",
    name: "Manas Ranjan Mishra",
    email: "manas.mishra@bankadmin.coop",
    role: ROLES.SUPER_ADMIN,
    branch: "Head Office (Bhubaneswar)",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  });

  const switchRole = (newRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole
    }));
  };

  const hasPermission = (moduleName, action = 'View') => {
    if (currentUser.role === ROLES.SUPER_ADMIN) return true;
    const permissions = ROLE_PERMISSIONS[currentUser.role];
    if (!permissions) return false;
    if (permissions.all) return true;
    
    const modulePerms = permissions[moduleName];
    if (!modulePerms) return false;
    return modulePerms.includes(action);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, switchRole, hasPermission, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
