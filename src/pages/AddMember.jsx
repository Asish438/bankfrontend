import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Briefcase,
  FileCheck,
  ArrowLeft,
  Save,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { Input, Select } from '../components/common/FormControls';
import { Breadcrumb } from '../components/common/DisplayComponents';

export const AddMember = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',

    // Address
    address: '',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: '',

    // Additional
    occupation: 'Salaried Professional',
    nomineeName: '',
    nomineeRelationship: 'Spouse',
    branch: 'Bhubaneswar Main',

    // Documents
    idProofType: 'Aadhaar Card',
    idProofNumber: '',
    addressProofType: 'Electricity Utility Bill',
    panCard: '',
    photoUploaded: true,
    signUploaded: true
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.dob) errs.dob = "Date of birth is required";
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      errs.mobile = "Valid 10-digit mobile number is required";
    }
    if (formData.email && !formData.email.includes('@')) {
      errs.email = "Enter a valid email address";
    }
    if (!formData.address.trim()) errs.address = "Address line is required";
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      errs.pincode = "Valid 6-digit PIN code is required";
    }
    if (!formData.nomineeName.trim()) errs.nomineeName = "Nominee name is required";
    if (!formData.idProofNumber.trim()) errs.idProofNumber = "Document identity number is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix the errors in the form before saving.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createMember(formData);
      showToast(`Member ${created.name} (${created.id}) created successfully!`, "success");
      navigate('/members');
    } catch (err) {
      showToast("Failed to create member.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Breadcrumb & Top Bar */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Members & KYC', link: '/members' },
            { label: 'Add New Member' }
          ]}
        />
        <div className="page-header" style={{ marginTop: '8px' }}>
          <div className="page-header-title-wrap">
            <h1>New Member Registration</h1>
            <p>Enroll a new co-operative society member and initialize KYC records.</p>
          </div>
          <div className="page-header-actions">
            <Link to="/members" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Cancel</span>
            </Link>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Member'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Personal Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <User size={18} color="var(--primary-600)" />
              <span>Personal Information</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Section 1 of 4</span>
          </div>
          <div className="card-body">
            <div className="form-grid-3" style={{ marginBottom: '16px' }}>
              <Input
                label="First Name"
                name="firstName"
                placeholder="e.g. Subrat"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName}
                required
              />
              <Input
                label="Middle Name"
                name="middleName"
                placeholder="e.g. Kumar"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="e.g. Pradhan"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName}
                required
              />
            </div>

            <div className="form-grid-4">
              <Input
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                error={errors.dob}
                required
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                options={["Male", "Female", "Other"]}
                required
              />
              <Input
                label="Mobile Number"
                name="mobile"
                placeholder="e.g. 9861002233"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                error={errors.mobile}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="e.g. subrat@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MapPin size={18} color="var(--primary-600)" />
              <span>Residential Address</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Section 2 of 4</span>
          </div>
          <div className="card-body">
            <div className="form-grid" style={{ marginBottom: '16px' }}>
              <Input
                label="Address Line"
                name="address"
                placeholder="Plot/Flat number, Street, Landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
                required
              />
              <Input
                label="City / Town"
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="form-grid">
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
              <Input
                label="PIN Code"
                name="pincode"
                placeholder="e.g. 751001"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                error={errors.pincode}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Additional & Nominee */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Briefcase size={18} color="var(--primary-600)" />
              <span>Nominee & Institutional Assignment</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Section 3 of 4</span>
          </div>
          <div className="card-body">
            <div className="form-grid-4">
              <Select
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                options={[
                  "Salaried Professional",
                  "Business Owner / Merchant",
                  "Farmer / Agriculture",
                  "Govt. Employee",
                  "Self Help Group Leader",
                  "Chartered Accountant / Doctor",
                  "Retired / Pensioner"
                ]}
                required
              />
              <Input
                label="Nominee Name"
                name="nomineeName"
                placeholder="e.g. Anjali Pradhan"
                value={formData.nomineeName}
                onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                error={errors.nomineeName}
                required
              />
              <Select
                label="Nominee Relationship"
                name="nomineeRelationship"
                value={formData.nomineeRelationship}
                onChange={(e) => setFormData({ ...formData, nomineeRelationship: e.target.value })}
                options={["Spouse", "Father", "Mother", "Son", "Daughter", "Brother", "Sister"]}
                required
              />
              <Select
                label="Assigned Branch"
                name="branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                options={[
                  "Bhubaneswar Main",
                  "Cuttack Central",
                  "Puri Beach Road",
                  "Rourkela Main",
                  "Sambalpur City",
                  "Balasore North"
                ]}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Documents Upload Simulation */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileCheck size={18} color="var(--primary-600)" />
              <span>KYC Compliance & Verification Documents</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Section 4 of 4</span>
          </div>
          <div className="card-body">
            <div className="form-grid" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Select
                  label="Identity Proof Type"
                  name="idProofType"
                  value={formData.idProofType}
                  onChange={(e) => setFormData({ ...formData, idProofType: e.target.value })}
                  options={["Aadhaar Card", "PAN Card", "Voter ID", "Passport", "Driving License"]}
                  required
                />
                <Input
                  label="ID Document / Number"
                  name="idProofNumber"
                  placeholder="e.g. 4829 1092 8821"
                  value={formData.idProofNumber}
                  onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                  error={errors.idProofNumber}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Select
                  label="Address Proof Type"
                  name="addressProofType"
                  value={formData.addressProofType}
                  onChange={(e) => setFormData({ ...formData, addressProofType: e.target.value })}
                  options={["Electricity Utility Bill", "Water Tax Receipt", "Bank Passbook", "Rent Agreement", "Aadhaar Card"]}
                  required
                />
                <Input
                  label="PAN Card Number (Optional)"
                  name="panCard"
                  placeholder="e.g. ABCDP1234K"
                  value={formData.panCard}
                  onChange={(e) => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            {/* Document Upload Simulator Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: "Passport Photograph", desc: "JPG, PNG (Max 2MB)", icon: Upload },
                { label: "Specimen Signature", desc: "JPG, PNG (Max 1MB)", icon: Upload },
                { label: "Identity Proof Scan", desc: "PDF, JPG (Max 5MB)", icon: Upload },
                { label: "Address Proof Scan", desc: "PDF, JPG (Max 5MB)", icon: Upload }
              ].map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    border: '1px dashed var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <doc.icon size={18} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{doc.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.desc}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--status-success-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCircle size={12} />
                    <span>Attached</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Bottom Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          <Link to="/members" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
          >
            <Save size={18} />
            <span>{isSubmitting ? 'Registering Member...' : 'Save & Register Member'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
