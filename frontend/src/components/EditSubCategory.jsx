import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { X } from "lucide-react";

export default function EditSubCategory({ subcategory, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  /* Prefill data */
  useEffect(() => {
    if(!subcategory) return;

    setForm({
      name: subcategory.name || "",
      description: subcategory.description || "",
    });

    setPreview(
      `http://localhost:5000/subcategories/image/${subcategory._id}`
    );

    setImage(null);
    if(fileRef.current) fileRef.current.value = "";
  }, [subcategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;

    if(!file.type.startsWith("image/")){
      toast.error("Only image files are allowed");
      return;
    }

    if(file.size > 5*1024*1024){
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
      data.append("description", form.description.trim());

      if(image){
        data.append("image", image);
      }

      await api.patch(`/subcategories/${subcategory._id}`, data);

      toast.success("Subcategory updated successfully");
      onSuccess();
      onClose();
    } 
    catch(err){
      toast.error("Failed to update subcategory");
    } 
    finally{
      setLoading(false);
    }
  };

  if(!subcategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/40 backdrop-blur-sm px-4" role="dialog" aria-modal="true"
    >
      <div
        className="relative w-full max-w-md max-h-[90vh]
        bg-white rounded-2xl shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="relative border-b px-6 py-4 text-center shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            Edit SubCategory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update subcategory details
          </p>

          <button type="button" onClick={onClose} aria-label="Close modal"
            className="absolute right-4 top-4 rounded-full p-1.5
            text-gray-500 hover:bg-gray-100 hover:text-gray-700
            transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM (Footer is INSIDE form now) */}
        <form onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable content */}
          <div className="px-6 py-5 space-y-4 overflow-y-auto">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                SubCategory Name <span className="text-red-500">*</span>
              </label>
              <input name="name" value={form.name}
                onChange={handleChange} placeholder="Enter subcategory name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea name="description" value={form.description}
                onChange={handleChange} rows={3}
                placeholder="Enter description"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SubCategory Image
              </label>

              <label
                htmlFor="subcategory-image"
                className="flex items-center gap-4 rounded-xl border-2 border-dashed
                border-gray-300 p-4 cursor-pointer hover:border-indigo-500
                hover:bg-indigo-50/30 transition"
              >
                <input ref={fileRef} id="subcategory-image"
                  type="file" accept="image/*"
                  onChange={handleImageChange} className="hidden"
                />

                <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-gray-100">
                  <img src={preview || "/placeholder.png"} alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 w-full text-[10px] text-center py-0.5 text-white
                    ${image ? "bg-green-600" : "bg-blue-600"}`}
                  >
                    {image ? "New Image" : "Current Image"}
                  </span>
                </div>

                <div className="text-sm">
                  <p className="font-medium text-gray-700">
                    {image ? "New image selected" : "Click to change image"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG or JPG (max 5MB)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0">
            <button type="button" onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm
              hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold
              text-white hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

