import { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { X } from "lucide-react";

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
    if(!file) return;

    if(!file.type.startsWith("image/")){
      toast.error("Only image files are allowed");
      return;
    }

    if(file.size > 5 * 1024 * 1024){
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;

    if(!form.name.trim()){
      return toast.error("Category name is required");
    }

    try{
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name.trim());

      if(form.description.trim())
        data.append("description", form.description.trim());

      if(image) data.append("image", image);

      await api.post("/categories", data);

      toast.success("Category added successfully");

      setForm({ name: "", description: "" });
      setImage(null);
      setPreview(null);

      if(fileRef.current) fileRef.current.value = "";
      onSuccess();
    }
    catch(err){
      toast.error(err.response?.data?.message || "Failed to add category");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 overflow-hidden">
      <div className="w-full max-w-md max-h-[90vh] bg-white rounded-2xl 
        shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out]"
      >
        {/* Header */}
        <div className="relative border-b px-6 py-4 text-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            Add New Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Organize products using categories
          </p>

          {/* Close Button */}
          <button type="button" onClick={onClose} aria-label="Close modal"
            className="absolute right-4 top-4 rounded-full p-1.5
              text-gray-500 hover:bg-gray-100 hover:text-gray-700
              transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={18} />
          </button>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit}
          className="px-6 py-6 space-y-5 overflow-y-auto flex-1"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input name="name" placeholder="e.g. Electronics"
              value={form.name} onChange={handleChange} autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea name="description" placeholder="Enter description"
              value={form.description} onChange={handleChange} rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2
              resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Image
            </label>

            <label htmlFor="image-upload"
              className="flex items-center gap-4 rounded-xl border-2 border-dashed
              border-gray-300 p-4 cursor-pointer hover:border-blue-500 transition"
            >
              <input id="image-upload" ref={fileRef}
                type="file" accept="image/*"
                onChange={handleImageChange} className="hidden"
              />

              {preview ? (
                <div className="h-20 w-20 rounded-lg overflow-hidden border">
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-20 w-20 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  📷
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-700">
                  {preview ? "Change image" : "Click to upload image"}
                </p>
                <p className="text-xs text-gray-500">PNG or JPG (max 5MB)</p>
              </div>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm transition"
          >
            Cancel
          </button>

          <button type="submit" disabled={loading} onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white
            hover:bg-blue-700 text-sm disabled:opacity-60 flex items-center gap-2 transition"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Saving..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}


