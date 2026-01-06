import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function EditCategory({ id, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

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

      setPreview(`http://localhost:5000/categories/image/${id}`);
      setIsNewImage(false);
    } catch {
      toast.error("Failed to load category");
    }
  };

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
    setIsNewImage(true);
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
      if (form.description.trim()) data.append("description", form.description.trim());
      if (image) data.append("image", image);

      await api.patch(`/categories/${id}`, data);

      setPreview(`http://localhost:5000/categories/image/${id}?t=${Date.now()}`);
      setIsNewImage(false);
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";

      toast.success("Category updated successfully");
      setTimeout(() => onSuccess(), 0);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]">

        {/* HEADER */}
        <div className="border-b px-6 py-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update category details
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2
              resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* IMAGE UPLOAD (MATCHED UI) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>

            <label
              htmlFor="image-upload"
              className="group flex items-center gap-4 rounded-xl border-2 border-dashed
              border-gray-300 p-4 cursor-pointer hover:border-blue-500 transition"
            >
              <input
                id="image-upload"
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="relative h-20 w-20 rounded-lg overflow-hidden border">
                <img
                  src={preview || "/placeholder.png"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <span
                  className={`absolute bottom-0 w-full text-[10px] text-center py-0.5 text-white
                  ${isNewImage ? "bg-green-600" : "bg-blue-600"}`}
                >
                  {isNewImage ? "New Image" : "Current Image"}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-700">
                  {isNewImage ? "New image selected" : "Click to change image"}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </label>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 text-sm disabled:opacity-60
              flex items-center gap-2 transition"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

