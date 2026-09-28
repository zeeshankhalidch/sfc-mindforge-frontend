import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Wallet,
  Lightbulb,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import toast from "react-hot-toast";

import API from "../../api/axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = [
    "#7f1d3a",
    "#d97706",
    "#2563eb",
    "#16a34a",
    "#a855f7",
    "#0ea5e9",
    "#f43f5e",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error(e);
      }
    }

    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await API.get("/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const income = dashboardData?.balance?.income || 0;
  const expense = dashboardData?.balance?.expense || 0;
  const balance = dashboardData?.balance?.total || 0;
  const savingsGoal = user?.savingsGoal || 0;
  const topCategory = dashboardData?.topCategory;
  const spending = dashboardData?.spendingBreakdown || [];
  const budgets = dashboardData?.budgets || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name?.split(" ")[0] || "Student";

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-heading dashboard-heading">
          <div>
            <h1>Loading...</h1>
            <p>Fetching your data from server</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-heading dashboard-heading">
        <div>
          <h1>
            {getGreeting()}, {firstName}!
          </h1>
          <p>Here's your money overview for this month.</p>
        </div>

        <div className="quick-actions">
          <Link to="/transactions" className="outline-action">
            + Add Income
          </Link>

          <Link to="/transactions" className="primary-action">
            + Add Expense
          </Link>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card income-card">
          <span className="summary-label">Total Income</span>
          <h2>₹{income.toLocaleString()}</h2>
          <span className="summary-change positive">
            <ArrowUpRight size={14} />
            This month
          </span>
        </div>

        <div className="summary-card expense-card">
          <span className="summary-label">Total Expenses</span>
          <h2>₹{expense.toLocaleString()}</h2>
          <span className="summary-change negative">
            <ArrowDownRight size={14} />
            This month
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">Balance</span>
          <h2>₹{balance.toLocaleString()}</h2>
          <span className="summary-change positive">
            <Wallet size={14} />
            Available balance
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">Savings Goal</span>
          <h2>₹{savingsGoal.toLocaleString()}</h2>
          <span className="summary-change goal">
            <PiggyBank size={14} />
            Your target
          </span>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Budget vs Actual</h3>
              <p>Your category spending this month</p>
            </div>
            <Link to="/budgets">View all</Link>
          </div>

          <div className="budget-list">
            {budgets.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>
                No budgets set yet. Go to Budgets page to create one.
              </p>
            ) : (
              budgets.map((budget) => {
                const percent = budget.limit
                  ? Math.round((budget.spent / budget.limit) * 100)
                  : 0;

                return (
                  <div
                    className="budget-item"
                    key={budget._id || budget.category}
                  >
                    <div className="budget-info">
                      <span>{budget.categoryName || budget.name}</span>
                      <small>
                        ₹{(budget.spent || 0).toLocaleString()} / ₹
                        {(budget.limit || 0).toLocaleString()}
                      </small>
                    </div>

                    <div className="progress-track">
                      <div
                        className={
                          percent > 100
                            ? "progress-fill over-budget"
                            : "progress-fill"
                        }
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    <span
                      className={
                        percent > 100
                          ? "budget-percent over-text"
                          : "budget-percent"
                      }
                    >
                      {percent}%
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="dashboard-panel spending-panel">
          <div className="panel-heading">
            <div>
              <h3>Spending Overview</h3>
              <p>Where your money went</p>
            </div>
          </div>

          <div className="spending-content">
            {spending.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>
                No spending data yet. Add some transactions.
              </p>
            ) : (
              <>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spending}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={73}
                        paddingAngle={2}
                      >
                        {spending.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={item.color || colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="chart-total">
                    <strong>₹{expense.toLocaleString()}</strong>
                    <span>Total Expenses</span>
                  </div>
                </div>

                <div className="chart-legend">
                  {spending.map((item, index) => (
                    <div key={item.name}>
                      <span
                        className="legend-color"
                        style={{
                          backgroundColor:
                            item.color || colors[index % colors.length],
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="dashboard-bottom">
        <div className="top-category">
          <span>This Month's Top Category</span>
          <strong>{topCategory?.category || "No data"}</strong>
          <p>
            ₹{(topCategory?.total || 0).toLocaleString()} spent this month
          </p>
        </div>

        <div className="saving-tip">
          <div className="tip-icon">
            <Lightbulb size={22} />
          </div>

          <div>
            <strong>Saving Tip</strong>
            <p>
              Your food spending is higher this month. Try setting a weekly
              food limit to stay on track.
            </p>
          </div>

          <Link to="/saving-tips">View tips</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;