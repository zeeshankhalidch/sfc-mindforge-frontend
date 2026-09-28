import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, Power } from "lucide-react";
import toast from "react-hot-toast";

import API from "../../../api/axios";
import "./Announcements.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/announcements");
      setAnnouncements(res.data.announcements || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const title = form.get("title")?.trim();
    const message = form.get("message")?.trim();
    const type = form.get("type") || "general";

    if (!title) return toast.error("Please enter a title");
    if (!message) return toast.error("Please enter the message");

    try {
      setSubmitting(true);
      const res = await API.post("/admin/announcements", {
        title,
        message,
        type,
      });

      toast.success(res.data.message || "Announcement sent!");
      formElement.reset();
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send");
    } finally {
      setSubmitting(false);
    }
  };

  const removeAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await API.delete(`/admin/announcements/${id}`);
      toast.success("Deleted");
      setAnnouncements((curr) => curr.filter((a) => a._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await API.put(`/admin/announcements/${id}/toggle`);
      const updated = res.data.announcement;
      setAnnouncements((curr) =>
        curr.map((a) => (a._id === id ? { ...a, isActive: updated.isActive } : a))
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
          <h1>Announcements</h1>
          <p>Send system-wide messages to all students.</p>
        </div>
      </div>

      <form className="ann-form" onSubmit={addAnnouncement} noValidate>
        <div className="ann-form-row">
          <select name="type" defaultValue="general">
            <option value="general">General</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="update">Update</option>
          </select>

          <input
            name="title"
            type="text"
            placeholder="Announcement title"
          />
        </div>

        <textarea
          name="message"
          placeholder="Write your announcement..."
          rows="3"
        />

        <button type="submit" disabled={submitting}>
          <Plus size={15} />
          {submitting ? "Sending..." : "Send to All Students"}
        </button>
      </form>

      {loading ? (
        <p className="ann-empty">Loading...</p>
      ) : announcements.length === 0 ? (
        <p className="ann-empty">No announcements yet.</p>
      ) : (
        <div className="ann-list">
          {announcements.map((ann) => (
            <article className="ann-item" key={ann._id}>
              <div className="ann-item-header">
                <div className="ann-item-title">
                  <Megaphone size={18} />
                  <h3>{ann.title}</h3>
                </div>

                <div className="ann-item-actions">
                  <span className={`ann-type ann-type-${ann.type}`}>
                    {ann.type}
                  </span>

                  <button
                    type="button"
                    className="ann-btn-toggle"
                    onClick={() => toggleActive(ann._id)}
                    title="Toggle active"
                  >
                    <Power size={15} />
                  </button>

                  <button
                    type="button"
                    className="ann-btn-delete"
                    onClick={() => removeAnnouncement(ann._id)}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p>{ann.message}</p>

              <div className="ann-item-meta">
                <span>
                  {new Date(ann.createdAt).toLocaleString()}
                </span>
                <span className={ann.isActive ? "ann-active" : "ann-inactive"}>
                  {ann.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcements;