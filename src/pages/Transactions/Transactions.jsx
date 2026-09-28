import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import API from "../../api/axios";
import "./Transactions.css";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // AI Categorization
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // CSV
  const [csvFile, setCsvFile] = useState(null);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResult, setCsvResult] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Categories load failed:", error);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filter === "all" || t.type === filter;
    const matchesSearch =
      (t.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.category?.name || "").toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  // ============ AI CATEGORIZATION ============
  useEffect(() => {
    if (!description || description.trim().length < 3) {
      setAiSuggestion(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setAiLoading(true);
        const res = await API.post("/ai/categorize", { description });
        if (res.data.suggestedCategory) {
          setAiSuggestion(res.data.suggestedCategory);
        } else {
          setAiSuggestion(null);
        }
      } catch (error) {
        // silent fail
      } finally {
        setAiLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [description]);

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      setSelectedCategory(aiSuggestion.id);
      toast.success(`Category set to ${aiSuggestion.name}`);
    }
  };

  // ============ ADD TRANSACTION ============
  const addTransaction = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const type = form.get("type");
    const amountValue = form.get("amount");
    const category = selectedCategory || form.get("category");
    const desc = form.get("description")?.trim();
    const date = form.get("date");
    const recurring = form.get("recurring") === "on";

    if (!type) return toast.error("Please choose income or expense");
    if (!amountValue) return toast.error("Please enter an amount");

    const amount = Number(amountValue);
    if (!Number.isFinite(amount) || amount <= 0)
      return toast.error("Amount must be greater than zero");
    if (!category) return toast.error("Please choose a category");
    if (!date) return toast.error("Please choose a date");

    try {
      await API.post("/transactions", {
        type,
        amount,
        category,
        description: desc || "",
        date,
        isRecurring: recurring,
      });

      if (aiSuggestion && desc) {
        API.post("/ai/categorize/feedback", {
          description: desc,
          userSelectedCategory: category,
        }).catch(() => {});
      }

      toast.success("Transaction added");
      formElement.reset();
      setDescription("");
      setSelectedCategory("");
      setAiSuggestion(null);
      setModalOpen(false);
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add");
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      setTransactions((curr) => curr.filter((t) => t._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ============ CSV IMPORT ============
  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length === 0 || !values[0]) continue;

      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      rows.push(row);
    }

    return rows;
  };

  const handleCsvFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }

    setCsvFile(file);
    setCsvResult(null);
  };

  const importCsv = async () => {
    if (!csvFile) return toast.error("Please select a CSV file");

    try {
      setCsvImporting(true);

      const text = await csvFile.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        toast.error("CSV file is empty or invalid");
        return;
      }

      const res = await API.post("/import/csv", {
        fileName: csvFile.name,
        rows,
      });

      setCsvResult({
        success: true,
        message: res.data.message,
        batch: res.data.batch,
      });

      toast.success(res.data.message);
      fetchTransactions();
    } catch (error) {
      const msg = error.response?.data?.message || "Import failed";
      setCsvResult({ success: false, message: msg });
      toast.error(msg);
    } finally {
      setCsvImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sample = `date,category,amount,type,description
2026-09-01,Food,500,expense,Lunch at canteen
2026-09-02,Transport,200,expense,Bus fare
2026-09-03,Allowance,15000,income,Monthly allowance
2026-09-04,Academics,800,expense,Textbook purchase`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const closeCsvModal = () => {
    setCsvModalOpen(false);
    setCsvFile(null);
    setCsvResult(null);
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="transactions-page">
      <div className="page-heading">
        <div>
          <h1>Transactions</h1>
          <p>Manage your income and expenses.</p>
        </div>

        <div className="transaction-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setCsvModalOpen(true)}
          >
            <Upload size={16} />
            Import CSV
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="transaction-toolbar">
        <div className="transaction-tabs">
          {["all", "income", "expense"].map((type) => (
            <button
              type="button"
              key={type}
              className={filter === type ? "active" : ""}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="transaction-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="transaction-table-wrap">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-table">
                  Loading...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-table">
                  No transactions found. Add your first one!
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.category?.name || "—"}</td>
                  <td>{t.description || "—"}</td>
                  <td
                    className={
                      t.type === "income" ? "income-amount" : "expense-amount"
                    }
                  >
                    {t.type === "income" ? "+" : "-"} ₹
                    {t.amount.toLocaleString()}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        aria-label="Edit"
                        onClick={() => toast("Edit coming soon")}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteTransaction(t._id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============ ADD TRANSACTION MODAL ============ */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="transaction-modal">
            <div className="modal-heading">
              <h2>Add Transaction</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={addTransaction} noValidate>
              <div className="type-selector">
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    defaultChecked
                  />
                  <span>Income</span>
                </label>
                <label>
                  <input type="radio" name="type" value="expense" />
                  <span>Expense</span>
                </label>
              </div>

              <div className="modal-field">
                <label>Amount</label>
                <input name="amount" type="number" placeholder="Enter amount" />
              </div>

              <div className="modal-field">
                <label>Description</label>
                <input
                  name="description"
                  type="text"
                  placeholder="e.g., Lunch at campus cafe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* AI Suggestion Box */}
                {aiLoading && (
                  <div className="ai-loading">
                    <Loader2 size={14} className="spin" />
                    AI is analyzing...
                  </div>
                )}

                {aiSuggestion && !aiLoading && (
                  <div className="ai-suggestion-box">
                    <div className="ai-suggestion-text">
                      <Sparkles size={14} />
                      <span>
                        AI suggests: <strong>{aiSuggestion.name}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={applyAiSuggestion}
                      className="ai-apply-btn"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-field">
                <label>Category</label>
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Choose category
                  </option>
                  <optgroup label="Income">
                    {incomeCategories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Expense">
                    {expenseCategories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="modal-field">
                <label>Date</label>
                <input
                  name="date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </div>

              <label className="recurring-check">
                <input name="recurring" type="checkbox" />
                Recurring transaction
              </label>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ CSV IMPORT MODAL ============ */}
      {csvModalOpen && (
        <div className="modal-backdrop">
          <div className="transaction-modal">
            <div className="modal-heading">
              <h2>Import CSV</h2>
              <button
                type="button"
                onClick={closeCsvModal}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="csv-instructions">
              Upload a CSV file with columns:{" "}
              <code>date, category, amount, type, description</code>
            </div>

            <div className="csv-upload-box">
              <Upload
                size={32}
                style={{ color: "#7f1d3a", marginBottom: 8 }}
              />

              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFile}
                className="csv-file-input"
              />

              {csvFile && (
                <p className="csv-file-selected">
                  ✅ {csvFile.name} selected
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={downloadSampleCSV}
              className="csv-sample-btn"
            >
              Download Sample CSV
            </button>

            {csvResult && (
              <div
                className={`csv-result ${
                  csvResult.success ? "csv-result-success" : "csv-result-error"
                }`}
              >
                {csvResult.message}
                {csvResult.batch && (
                  <div style={{ marginTop: 6 }}>
                    ✅ Successful: {csvResult.batch.successfulRows} | ❌ Failed:{" "}
                    {csvResult.batch.failedRows}
                  </div>
                )}
              </div>
            )}

            <div className="modal-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={closeCsvModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={importCsv}
                disabled={csvImporting || !csvFile}
              >
                {csvImporting ? (
                  <>
                    <Loader2 size={15} className="spin" /> Importing...
                  </>
                ) : (
                  <>
                    <Upload size={15} /> Import
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;