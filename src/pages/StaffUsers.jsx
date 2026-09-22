import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Shield,
  UserX,
  UserPlus,
  KeyRound,
  Eye,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { formatDate, formatMobile } from '../services/formatters';
import { exportToExcel } from '../services/exportService';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';
import { AddStaffModal, ResetPasswordModal } from '../components/modals/StaffModals';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useNotifications } from '../context/NotificationContext';

export const StaffUsers = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [resetPassStaff, setResetPassStaff] = useState(null);
  const [toggleStatusStaff, setToggleStatusStaff] = useState(null);
  const { showToast } = useNotifications();

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const res = await api.getStaff();
      setStaffList(res);
      setFilteredStaff(res);
    } catch (e) {
      console.error(e);
      showToast("Unable to fetch staff list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    let result = [...staffList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.mobile.includes(q)
      );
    }

    if (roleFilter !== 'ALL') {
      result = result.filter(s => s.role === roleFilter);
    }

    setFilteredStaff(result);
    setCurrentPage(1);
  }, [searchQuery, roleFilter, staffList]);

  const totalCount = staffList.length;
  const activeCount = staffList.filter(s => s.status === 'Active').length;
  const inactiveCount = staffList.filter(s => s.status === 'Inactive').length;
  const adminCount = staffList.filter(s => s.role.includes('Admin')).length;

  const handleToggleStatus = async () => {
    if (!toggleStatusStaff) return;
    try {
      const updated = await api.toggleStaffStatus(toggleStatusStaff.id);
      showToast(`Staff member ${updated.name} set to ${updated.status}.`, "success");
      setToggleStatusStaff(null);
      loadStaff();
    } catch (e) {
      showToast("Error updating staff status.", "error");
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredStaff.map(s => ({
      "Staff ID": s.id,
      "Name": s.name,
      "Email": s.email,
      "Mobile": s.mobile,
      "Role": s.role,
      "Department": s.department,
      "Branch": s.branch,
      "Status": s.status,
      "Last Login": s.lastLogin
    }));
    exportToExcel(exportData, `BankAdmin_Staff_Roster_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Staff roster exported to Excel spreadsheet (.xlsx).", "success");
  };

  const paginatedData = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'Staff ID',
      key: 'id',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{val}</span>
    },
    {
      header: 'Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      )
    },
    {
      header: 'Mobile',
      key: 'mobile',
      render: (val) => formatMobile(val)
    },
    {
      header: 'Role',
      key: 'role',
      render: (val) => (
        <span
          style={{
            fontSize: '0.76rem',
            padding: '3px 8px',
            borderRadius: '4px',
            backgroundColor: val.includes('Admin') ? 'var(--primary-50)' : 'var(--bg-surface-muted)',
            color: val.includes('Admin') ? 'var(--primary-700)' : 'var(--text-primary)',
            fontWeight: 700
          }}
        >
          {val}
        </span>
      )
    },
    { header: 'Branch', key: 'branch' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    { header: 'Last Login', key: 'lastLogin' },
    {
      header: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setResetPassStaff(row)}
            title="Reset Password"
            style={{ padding: '5px 8px' }}
          >
            <KeyRound size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setToggleStatusStaff(row)}
            title={row.status === 'Active' ? 'Deactivate User' : 'Activate User'}
            style={{ padding: '5px 8px', color: row.status === 'Active' ? 'var(--status-danger)' : 'var(--status-success-text)' }}
          >
            {row.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Staff & User Management</h1>
          <p>Institutional officers, tellers, branch managers, and credential controls.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            <span>Export to Excel (.xlsx)</span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddStaffOpen(true)}>
            <UserPlus size={16} />
            <span>+ Add Staff User</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Staff"
          value={totalCount}
          icon={UserCheck}
          iconColor="#2563eb"
          iconBg="rgba(37, 99, 235, 0.12)"
          trend="Institutional workforce"
        />
        <StatCard
          title="Active Users"
          value={activeCount}
          icon={CheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          trend="Operational logins"
          trendType="positive"
        />
        <StatCard
          title="Inactive Accounts"
          value={inactiveCount}
          icon={UserX}
          iconColor="#ef4444"
          iconBg="rgba(239, 68, 68, 0.12)"
          trend="Deactivated / Suspended"
          trendType="neutral"
        />
        <StatCard
          title="Administrators"
          value={adminCount}
          icon={Shield}
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.12)"
          trend="Privileged credentials"
        />
      </div>

      {/* Table Card */}
      <div className="card">
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search staff name, email or ID..."
            width="340px"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              className="form-control"
              style={{ width: '180px' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Accountant">Accountant</option>
              <option value="Cashier">Cashier</option>
              <option value="Loan Officer">Loan Officer</option>
              <option value="KYC Officer">KYC Officer</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable rows={8} cols={8} />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedData}
              keyField="id"
              emptyMessage="No staff users found matching criteria."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredStaff.length / pageSize)}
              totalItems={filteredStaff.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSuccess={loadStaff}
      />

      <ResetPasswordModal
        isOpen={Boolean(resetPassStaff)}
        onClose={() => setResetPassStaff(null)}
        staff={resetPassStaff}
      />

      <ConfirmDialog
        isOpen={Boolean(toggleStatusStaff)}
        onClose={() => setToggleStatusStaff(null)}
        onConfirm={handleToggleStatus}
        title={toggleStatusStaff?.status === 'Active' ? 'Deactivate User Account' : 'Reactivate User Account'}
        message={`Are you sure you want to change login access for ${toggleStatusStaff?.name} (${toggleStatusStaff?.role}) to ${toggleStatusStaff?.status === 'Active' ? 'Inactive' : 'Active'}?`}
        confirmText={toggleStatusStaff?.status === 'Active' ? 'Deactivate' : 'Activate'}
        type={toggleStatusStaff?.status === 'Active' ? 'danger' : 'success'}
      />
    </div>
  );
};
