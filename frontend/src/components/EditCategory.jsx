import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function EditCategory({ id, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  /* ================= FETCH CATEGORY ================= */
  useEffect(() => {
    if (id) fetchCategory();
    // eslint-disable-next-line
  }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await api.get(`/categories/${id}`);
      setForm({
        name: res.data.name || "",
        description: res.data.description || "",
      });

      // existing image preview (buffer-based image API)
      setPreview(
        `${import.meta.env.VITE_API_URL}/categories/image/${id}`
      );
    } catch (err) {
      console.error("Failed to load category", err);
      toast.error("Failed to load category");
    }
  };

  /* ================= HANDLERS ================= */
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
      toast.error("Image must be less than 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
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

      // ✅ PATCH (partial update)
      await api.patch(`/categories/${id}`, data);

      toast.success("Category updated successfully");

      setImage(null);
      if (fileRef.current) fileRef.current.value = "";

      onSuccess();
    } catch (err) {
      console.error("Failed to update category", err);
      toast.error(err.response?.data?.message || "Update failed");
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
        <h2 className="text-2xl font-semibold text-center mb-6">
          Edit Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 
              focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-2 resize-none 
              focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Image
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-24 w-24 rounded-lg 
                object-cover border"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg 
              bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg 
              bg-blue-600 text-white hover:bg-blue-700 
              disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

