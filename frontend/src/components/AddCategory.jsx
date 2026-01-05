import { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function AddCategory({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name.trim());

      if (form.description.trim()) {
        data.append("description", form.description.trim());
      }

      if (image) {
        data.append("image", image);
      }

      await api.post("/categories", data);

      toast.success("Category added successfully");

      setForm({ name: "", description: "" });
      setImage(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";

      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add New Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="e.g. Electronics"
              value={form.name}
              onChange={handleChange}
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
              focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Optional description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
              resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Image
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-24 w-24 rounded-lg object-cover border"
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 
              hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 
              text-white hover:bg-blue-700 text-sm 
              disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


