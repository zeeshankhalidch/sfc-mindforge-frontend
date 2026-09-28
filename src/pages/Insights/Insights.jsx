import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import API from "../../api/axios";
import "./Insights.css";

function Insights() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("savedInsights") || "[]");
    setSavedIds(saved);

    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await API.get("/insights");
      setInsights(res.data.insights || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  // ✅ AI INSIGHT GENERATE
  const generateInsight = async () => {
    try {
      setGenerating(true);
      const res = await API.post("/insights/generate");

      toast.success("Insight generated!");

      // Nayi insight list mein add karo (top pe)
      const newInsight = res.data.insight;
      setInsights((curr) => {
        const filtered = curr.filter((i) => i.month !== newInsight.month);
        return [newInsight, ...filtered];
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to generate insight. Add transactions first."
      );
    } finally {
      setGenerating(false);
    }
  };

  const deleteInsight = async (id) => {
    if (!window.confirm("Delete this insight?")) return;
    try {
      await API.delete(`/insights/${id}`);
      setInsights((curr) => curr.filter((i) => i._id !== id));
      toast.success("Deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const toggleSaved = (id) => {
    let updated;
    if (savedIds.includes(id)) {
      updated = savedIds.filter((x) => x !== id);
      toast.success("Removed from saved");
    } else {
      updated = [...savedIds, id];
      toast.success("Insight saved");
    }
    setSavedIds(updated);
    localStorage.setItem("savedInsights", JSON.stringify(updated));
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Spending Insights</h1>
          <p>AI-generated summaries of your spending patterns.</p>
        </div>

        <button
          type="button"
          onClick={generateInsight}
          disabled={generating}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#7f1d3a",
            color: "#ffffff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            fontFamily: "inherit",
            cursor: generating ? "not-allowed" : "pointer",
            opacity: generating ? 0.7 : 1,
            transition: "background 0.2s",
          }}
        >
          {generating ? (
            <>
              <Loader2 size={16} className="spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Insight
            </>
          )}
        </button>
      </div>

      <div className="insight-banner">
        <TrendingUp size={19} />
        {insights.length > 0
          ? `${insights.length} insight${insights.length > 1 ? "s" : ""} generated. Click "Generate Insight" for the latest summary.`
          : "Click Generate Insight to analyze your monthly spending."}
      </div>

      {loading ? (
        <p style={{ padding: "20px", color: "#888" }}>Loading insights...</p>
      ) : insights.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#888",
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Sparkles size={40} style={{ color: "#d1d5db", marginBottom: 12 }} />
          <h3 style={{ color: "#6b7280", marginBottom: 6 }}>No insights yet</h3>
          <p style={{ fontSize: 13, marginBottom: 20 }}>
            Add some transactions and click "Generate Insight" to see a monthly summary.
          </p>
          <button
            type="button"
            onClick={generateInsight}
            disabled={generating}
            style={{
              background: "#7f1d3a",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {generating ? "Generating..." : "Generate Now"}
          </button>
        </div>
      ) : (
        <div className="insights-list">
          {insights.map((insight) => (
            <article className="insight-card" key={insight._id}>
              <div className="insight-date">
                <CalendarDays size={17} />
                {insight.month}
              </div>

              <div className="insight-heading">
                <h2>
                  {insight.summaryText?.split(".")[0] || "Monthly Summary"}
                </h2>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => toggleSaved(insight._id)}
                    aria-label="Save insight"
                    title={savedIds.includes(insight._id) ? "Unsave" : "Save"}
                  >
                    {savedIds.includes(insight._id) ? (
                      <BookmarkCheck size={19} />
                    ) : (
                      <Bookmark size={19} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteInsight(insight._id)}
                    aria-label="Delete insight"
                    title="Delete"
                    style={{ color: "#dc2626" }}
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              </div>

              <p>{insight.summaryText}</p>

              {insight.flaggedCategories?.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "#fef3c7",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#92400e",
                  }}
                >
                  {insight.flaggedCategories.map((f, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      ⚠️ {f.message}
                    </div>
                  ))}
                </div>
              )}

              {insight.tipText && (
                <div className="insight-advice">
                  <Lightbulb size={17} />
                  <div>
                    <strong>Suggested action</strong>
                    <span>{insight.tipText}</span>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Insights;