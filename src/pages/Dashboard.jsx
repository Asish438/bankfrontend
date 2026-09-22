import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  CreditCard,
  PiggyBank,
  Landmark,
  Wallet,
  Receipt,
  Eye,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { formatINR, formatDate } from '../services/formatters';
import { StatCard } from '../components/common/StatCard';
import { ChartCard } from '../components/common/DisplayComponents';
import { Table } from '../components/common/Table';
import { StatusBadge } from '../components/common/StatusBadge';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeletons';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [growthYear, setGrowthYear] = useState('2026');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.getDashboardData();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '280px', height: '32px', marginBottom: '8px' }}></div>
          <div className="skeleton" style={{ width: '380px', height: '18px' }}></div>
        </div>
        <SkeletonCard count={8} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-lg)' }}></div>
          <div className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-lg)' }}></div>
        </div>
      </div>
    );
  }

  const currentDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const memberColumns = [
    {
      header: 'Member ID',
      key: 'id',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{val}</span>
    },
    {
      header: 'Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.branch}</div>
        </div>
      )
    },
    { header: 'Mobile', key: 'mobile' },
    {
      header: 'KYC Status',
      key: 'kycStatus',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Joining Date',
      key: 'joiningDate',
      render: (val) => formatDate(val)
    },
    {
      header: 'Action',
      key: 'id',
      align: 'right',
      render: (val) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/members/${val}`)}
          style={{ padding: '4px 8px' }}
          title="View Profile"
        >
          <Eye size={14} />
          <span>View</span>
        </button>
      )
    }
  ];

  const transactionColumns = [
    {
      header: 'Txn ID',
      key: 'id',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    {
      header: 'Member',
      key: 'memberName',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.accountNumber}</div>
        </div>
      )
    },
    { header: 'Type', key: 'type' },
    {
      header: 'Amount',
      key: 'amount',
      render: (val, row) => (
        <span
          style={{
            fontWeight: 700,
            color: row.type === 'Withdrawal' ? 'var(--status-danger)' : 'var(--status-success-text)'
          }}
        >
          {row.type === 'Withdrawal' ? `-${formatINR(val)}` : `+${formatINR(val)}`}
        </span>
      )
    },
    {
      header: 'Mode',
      key: 'paymentMode',
      render: (val) => (
        <span
          style={{
            fontSize: '0.76rem',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-surface-muted)',
            fontWeight: 600
          }}
        >
          {val}
        </span>
      )
    },
    { header: 'Date', key: 'date' }
  ];

  const totalLoansCount = data.loanStatusDistribution.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dashboard Top Header */}
      <div className="page-header">
        <div className="page-header-title-wrap">
          <h1>Welcome back, Admin!</h1>
          <p>Here's what's happening in your institution today.</p>
        </div>
        <div className="page-header-actions">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}
          >
            <Calendar size={16} color="var(--primary-600)" />
            <span>{currentDateFormatted}</span>
          </div>
        </div>
      </div>

      {/* 8 Statistics Cards Grid */}
      <div className="stat-card-grid">
        {/* Card 1: Total Members */}
        <StatCard
          title="Total Members"
          value="1,248"
          icon={Users}
          trend="↑ 12%"
          trendType="positive"
          trendText="from last month"
          iconColor="#2563eb"
          iconBg="rgba(37, 99, 235, 0.12)"
          onClick={() => navigate('/members')}
        />

        {/* Card 2: Active Members */}
        <StatCard
          title="Active Members"
          value="1,132"
          icon={UserCheck}
          trend="↑ 8%"
          trendType="positive"
          trendText="90.7% active rate"
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.12)"
          onClick={() => navigate('/members')}
        />

        {/* Card 3: Pending KYC */}
        <StatCard
          title="Pending KYC"
          value="86"
          icon={Clock}
          trend="↓ 5%"
          trendType="neutral"
          trendText="Requires verification"
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.12)"
          onClick={() => navigate('/kyc')}
        />

        {/* Card 4: Savings Accounts */}
        <StatCard
          title="Savings Accounts"
          value="920"
          icon={CreditCard}
          trend="↑ 15%"
          trendType="positive"
          trendText="from last month"
          iconColor="#0891b2"
          iconBg="rgba(8, 145, 178, 0.12)"
          onClick={() => navigate('/savings')}
        />

        {/* Card 5: RD Accounts */}
        <StatCard
          title="RD Accounts"
          value="210"
          icon={PiggyBank}
          trend="↑ 6%"
          trendType="positive"
          trendText="Active recurring"
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.12)"
          onClick={() => navigate('/rd')}
        />

        {/* Card 6: FD Accounts */}
        <StatCard
          title="FD Accounts"
          value="156"
          icon={Landmark}
          trend="↑ 18%"
          trendType="positive"
          trendText="High yield term"
          iconColor="#d97706"
          iconBg="rgba(217, 119, 6, 0.12)"
          onClick={() => navigate('/fd')}
        />

        {/* Card 7: Active Loans */}
        <StatCard
          title="Active Loans"
          value="98"
          icon={Wallet}
          trend="↑ 4%"
          trendType="positive"
          trendText="₹4.2 Cr portfolio"
          iconColor="#3b82f6"
          iconBg="rgba(59, 130, 246, 0.12)"
          onClick={() => navigate('/loans')}
        />

        {/* Card 8: Today's Collection */}
        <StatCard
          title="Today's Collection"
          value="₹4,85,230"
          icon={Receipt}
          trend="↑ 22%"
          trendType="positive"
          trendText="Across all counters"
          iconColor="#059669"
          iconBg="rgba(5, 150, 105, 0.14)"
          onClick={() => navigate('/collections')}
        />
      </div>

      {/* Charts Section: Member Growth Line Chart & Loan Status Donut Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Chart A: Member Growth */}
        <ChartCard
          title="Member Growth"
          subtitle="Cumulative verified membership trajectory"
          action={
            <select
              className="form-control"
              style={{ width: '130px', padding: '6px 10px', fontSize: '0.82rem' }}
              value={growthYear}
              onChange={(e) => setGrowthYear(e.target.value)}
            >
              <option value="2026">This Year (2026)</option>
              <option value="2025">Last Year (2025)</option>
            </select>
          }
        >
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.memberGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="members"
                  name="Members"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563eb' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart C: Loan Status Donut Chart */}
        <ChartCard
          title="Loan Status"
          subtitle={`Institutional loan distribution (${totalLoansCount} Total)`}
        >
          <div style={{ height: '300px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.loanStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.loanStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Count */}
            <div
              style={{
                position: 'absolute',
                top: '42%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {totalLoansCount}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Loans
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Chart B: Collection Overview Bar Chart */}
      <ChartCard
        title="Collection Overview"
        subtitle="Monthly comparison of Cash, UPI, and Bank Transfer receipts"
      >
        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.collectionOverview} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip
                formatter={(val) => formatINR(val)}
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '8px'
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={30}
                iconType="circle"
                formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
              />
              <Bar dataKey="Cash" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="UPI" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="BankTransfer" fill="#8b5cf6" name="Bank Transfer" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Recent Tables Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Members Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Members</h3>
              <p className="card-subtitle">Newly enrolled co-operative members</p>
            </div>
            <Link to="/members" className="btn btn-secondary btn-sm">
              <span>View All</span>
            </Link>
          </div>
          <Table columns={memberColumns} data={data.recentMembers} keyField="id" />
        </div>

        {/* Recent Transactions Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Transactions</h3>
              <p className="card-subtitle">Live core financial ledger postings</p>
            </div>
            <Link to="/accounting" className="btn btn-secondary btn-sm">
              <span>View All</span>
            </Link>
          </div>
          <Table columns={transactionColumns} data={data.recentTransactions} keyField="id" />
        </div>
      </div>
    </div>
  );
};
