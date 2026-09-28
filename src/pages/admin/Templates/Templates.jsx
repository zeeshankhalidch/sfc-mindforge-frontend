import { useEffect, useState } from "react";
import { Trash2, Power } from "lucide-react";
import toast from "react-hot-toast";

import API from "../../../api/axios";
import "./Templates.css";

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/tip-templates");
      setTemplates(res.data.templates || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const title = form.get("title")?.trim();
    const message = form.get("text")?.trim();
    const triggerType = form.get("triggerType") || "general";

    if (!title) return toast.error("Please enter a title");
    if (!message) return toast.error("Please enter the template text");

    try {
      setSubmitting(true);
      await API.post("/admin/tip-templates", { title, message, triggerType });
      toast.success("Template added");
      formElement.reset();
      fetchTemplates();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add");
    } finally {
      setSubmitting(false);
    }
  };

  const removeTemplate = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await API.delete(`/admin/tip-templates/${id}`);
      toast.success("Template removed");
      setTemplates((curr) => curr.filter((t) => t._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await API.put(`/admin/tip-templates/${id}/toggle`);
      const updated = res.data.template;
      setTemplates((curr) =>
        curr.map((t) => (t._id === id ? { ...t, isActive: updated.isActive } : t))
      );
      toast.success(updated.isActive ? "Activated" : "Deactivated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Toggle failed");
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Templates</h1>
          <p>Manage announcement and saving tip templates.</p>
        </div>
      </div>

      <form className="template-form" onSubmit={addTemplate} noValidate>
        <select name="triggerType" defaultValue="general">
          <option value="general">General</option>
          <option value="high_spending">High Spending</option>
          <option value="budget_near_limit">Budget Near Limit</option>
          <option value="budget_exceeded">Budget Exceeded</option>
          <option value="low_savings">Low Savings</option>
        </select>

        <input name="title" type="text" placeholder="Title" />

        <textarea name="text" placeholder="Template text" />

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Template"}
        </button>
      </form>

      {loading ? (
        <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
      ) : templates.length === 0 ? (
        <p style={{ padding: "20px", color: "#888" }}>No templates yet.</p>
      ) : (
        <div className="template-list">
          {templates.map((template) => (
            <article key={template._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{template.triggerType || "general"}</span>
                <div>
                  <button type="button" onClick={() => toggleActive(template._id)} title="Toggle">
                    <Power size={15} />
                  </button>
                  <button type="button" onClick={() => removeTemplate(template._id)} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h2>{template.title}</h2>
              <p>{template.message}</p>
              <small style={{ color: template.isActive ? "#16a34a" : "#dc2626" }}>
                {template.isActive ? "Active" : "Inactive"}
              </small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Templates;