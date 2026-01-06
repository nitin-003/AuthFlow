import { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { ImagePlus } from "lucide-react";

export default function AddSubCategory({ categoryId, onClose, onSuccess }){
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
      toast.error("Image must be less than 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;

    if(!form.name.trim()){
      return toast.error("Subcategory name is required");
    }

    try{
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("category", categoryId);
      if(form.description.trim())
        data.append("description", form.description.trim());
      if(image) data.append("image", image);

      await api.post("/subcategories", data);

      toast.success("Subcategory added successfully");
      onSuccess();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Failed to add subcategory");
    } 
    finally{
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/50 backdrop-blur-sm px-4 overflow-hidden"
      role="dialog" aria-modal="true"
    >
      <div
        className="w-full max-w-md max-h-[90vh]
          bg-white rounded-2xl shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out]"
      >
        {/* Header */}
        <div className="border-b px-6 py-4 text-center shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Subcategory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a subcategory inside this category
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}
          className="px-6 py-6 space-y-5 overflow-y-auto flex-1"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subcategory Name <span className="text-red-500">*</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Smartphones" autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea name="description" value={form.description}
              onChange={handleChange} rows={3}
              placeholder="Optional description"
              className="w-full rounded-lg border border-gray-300 px-3 py-2
              resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subcategory Image
            </label>

            <div
              className="relative rounded-xl border-2 border-dashed border-gray-300
              p-4 hover:border-blue-500 transition cursor-pointer bg-gray-50"
            >
              <input ref={fileRef} type="file" accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {!preview ? (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ImagePlus size={28} />
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs">PNG or JPG • Max 5MB</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border bg-white overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    <p className="font-medium text-gray-800">
                      Image selected
                    </p>
                    <p>Click again to replace</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer*/}
        <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200
            hover:bg-gray-300 text-sm transition"
          >
            Cancel
          </button>

          <button type="submit" disabled={loading} onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white
            hover:bg-blue-700 text-sm disabled:opacity-60 flex items-center gap-2 transition"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white
              border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Saving..." : "Add Subcategory"}
          </button>
        </div>
      </div>
    </div>
  );
}



