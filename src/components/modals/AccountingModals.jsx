import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/FormControls';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { mockAccounting } from '../../data/mockAccounting';

export const AddIncomeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: mockAccounting.incomeCategories[0],
    amount: '',
    description: '',
    paymentMode: 'Bank Transfer',
    reference: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = "Enter a valid positive amount";
    }
    if (!formData.description.trim()) {
      errs.description = "Description is required";
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.addIncome(formData);
      showToast("Income entry recorded successfully!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast("Failed to record income.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Institutional Income"
      subtitle="Credit income voucher to general ledger"
      size="md"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Income'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Select
          label="Income Category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={mockAccounting.incomeCategories}
          required
        />
        <Input
          label="Amount (₹)"
          name="amount"
          type="number"
          placeholder="e.g. 25000"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
          required
        />
        <Select
          label="Payment Mode"
          name="paymentMode"
          value={formData.paymentMode}
          onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
          options={["Bank Transfer", "UPI", "Cash", "Cheque"]}
          required
        />
        <Input
          label="Reference / Transaction No."
          name="reference"
          placeholder="e.g. UTR / Receipt # / Cheque #"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
        />
        <Input
          label="Description / Purpose"
          name="description"
          placeholder="e.g. Realization of interest on term deposits"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          required
        />
      </form>
    </Modal>
  );
};

export const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: mockAccounting.expenseCategories[0],
    amount: '',
    description: '',
    paymentMode: 'Bank Transfer',
    reference: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = "Enter a valid positive amount";
    }
    if (!formData.description.trim()) {
      errs.description = "Description is required";
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.addExpense(formData);
      showToast("Expense voucher recorded successfully!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast("Failed to record expense voucher.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Operating Expense"
      subtitle="Debit expense voucher from general ledger"
      size="md"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Expense Voucher'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Select
          label="Expense Category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={mockAccounting.expenseCategories}
          required
        />
        <Input
          label="Amount (₹)"
          name="amount"
          type="number"
          placeholder="e.g. 15000"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
          required
        />
        <Select
          label="Payment Mode"
          name="paymentMode"
          value={formData.paymentMode}
          onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
          options={["Bank Transfer", "UPI", "Cash", "Cheque"]}
          required
        />
        <Input
          label="Voucher / Reference No."
          name="reference"
          placeholder="e.g. VOUCH-2026-09"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
        />
        <Input
          label="Description / Purpose"
          name="description"
          placeholder="e.g. Office electricity bill payment"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          required
        />
      </form>
    </Modal>
  );
};
