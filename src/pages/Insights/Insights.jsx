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

  const generateInsight = async () => {
    try {
      setGenerating(true);
      const res = await API.post("/insights/generate");

      toast.success("Insight generated!");

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
          className="insights-generate-btn"
          onClick={generateInsight}
          disabled={generating}
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
        <p className="insights-loading">Loading insights...</p>
      ) : insights.length === 0 ? (
        <div className="insights-empty">
          <Sparkles size={40} className="insights-empty-icon" />
          <h3 className="insights-empty-title">No insights yet</h3>
          <p className="insights-empty-text">
            Add some transactions and click "Generate Insight" to see a monthly
            summary.
          </p>
          <button
            type="button"
            className="insights-generate-btn"
            onClick={generateInsight}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 size={16} className="spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Now
              </>
            )}
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

                <div className="insight-actions">
                  <button
                    type="button"
                    className="insight-save-btn"
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
                    className="insight-delete-btn"
                    onClick={() => deleteInsight(insight._id)}
                    aria-label="Delete insight"
                    title="Delete"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              </div>

              <p>{insight.summaryText}</p>

              {insight.flaggedCategories?.length > 0 && (
                <div className="insight-flagged">
                  {insight.flaggedCategories.map((f, i) => (
                    <div key={i} className="insight-flagged-item">
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