import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/FormControls';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { ROLES } from '../../context/AuthContext';
import { KeyRound, UserPlus } from 'lucide-react';

export const AddStaffModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: ROLES.LOAN_OFFICER,
    branch: 'Bhubaneswar Main',
    department: 'Branch Operations'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = "Valid email is required";
    if (!formData.mobile.trim() || formData.mobile.length < 10) errs.mobile = "10-digit mobile number required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.addStaff(formData);
      showToast(`Staff member ${formData.name} added successfully!`, "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast("Error adding staff member.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const branches = [
    "Head Office (Bhubaneswar)",
    "Bhubaneswar Main",
    "Cuttack Central",
    "Puri Beach Road",
    "Rourkela Main",
    "Sambalpur City",
    "Balasore North"
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Staff Member / System User"
      subtitle="Create institutional login credentials and assign system role"
      size="md"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            <UserPlus size={16} />
            <span>{isSubmitting ? 'Creating...' : 'Create Staff User'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Ramesh Chandra Mishra"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="ramesh@bankadmin.coop"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
          <Input
            label="Mobile Number"
            name="mobile"
            placeholder="9861000000"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            error={errors.mobile}
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Select
            label="System Role"
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={Object.values(ROLES)}
            required
          />
          <Select
            label="Assigned Branch"
            name="branch"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            options={branches}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export const ResetPasswordModal = ({ isOpen, onClose, staff }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotifications();

  if (!isOpen || !staff) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Temporary password reset credentials generated for ${staff.name}`, "success");
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset User Password"
      subtitle={`Generate new authentication key for ${staff.name} (${staff.role})`}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            <KeyRound size={16} />
            <span>{isSubmitting ? 'Resetting...' : 'Reset Password'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </form>
    </Modal>
  );
};
