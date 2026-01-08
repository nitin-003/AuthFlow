import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({ fetchProducts, onClose }){
  const [formData, setFormData] = useState({ name: "",
    sku: "", unit: "pcs", price: "", quantity: "",
    category: "", minStockLevel: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try{
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } 
      catch(err){
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;

    setImage(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleCategorySelect = (category) => {
    setFormData((p) => ({ ...p, category: category.name }));
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.name || !formData.sku || !formData.category){
      return toast.error("Name, SKU and Category are required");
    }

    try{
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));

      data.set("price", Number(formData.price || 0));
      data.set("quantity", Number(formData.quantity || 0));
      data.set("minStockLevel", Number(formData.minStockLevel || 0));

      if(image) data.append("image", image);

      await api.post("/products", data);

      toast.success("Product added successfully");
      fetchProducts();
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Product creation failed");
    } 
    finally{
      setLoading(false);
    }
  };

  /* Filter Categories */
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(formData.category.toLowerCase())
  );

  const input = "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  const label = "text-xs font-bold text-gray-600";

  return (
    <form onSubmit={handleSubmit}
      className="flex flex-col w-full max-h-[90vh]"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Add New Product</h2>
        <p className="text-sm text-gray-500">Add inventory details</p>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-5 overflow-y-auto flex-1">
        {/* Name */}
        <div>
          <label className={label}>Product Name *</label>
          <input autoFocus name="name" value={formData.name} 
            onChange={handleChange} className={input}
          />
        </div>

        {/* Image */}
        <div>
          <label className={label}>Product Image</label>
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 border rounded-xl overflow-hidden">
              {preview ? (
                <img src={preview} alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-gray-400 flex items-center justify-center h-full">
                  No Image
                </div>
              )}
            </div>

            <label className="cursor-pointer">
              <input type="file" accept="image/*" hidden
                onChange={handleImageChange}
              />
              <span className="px-4 py-2 bg-gray-200 rounded-xl text-sm">
                Upload
              </span>
            </label>
          </div>
        </div>

        {/* SKU / Price / Qty */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={label}>SKU *</label>
            <input name="sku" value={formData.sku} onChange={handleChange} className={input} />
          </div>
          <div>
            <label className={label}>Price</label>
            <input type="number" name="price" value={formData.price} 
              onChange={handleChange} className={input} />
          </div>
          <div>
            <label className={label}>Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} 
              onChange={handleChange} className={input} />
          </div>
        </div>

        {/* Unit / Min Stock / Category */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={label}>Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className={input}>
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="box">box</option>
            </select>
          </div>

          <div>
            <label className={label}>Min Stock</label>
            <input type="number" name="minStockLevel"
              value={formData.minStockLevel} onChange={handleChange} className={input}
            />
          </div>

          {/* Category */}
          <div className="relative" ref={dropdownRef}>
            <label className={label}>Category *</label>
            <input name="category" value={formData.category}
               onChange={(e) => {
                handleChange(e);
                setShowDropdown(true);
               }}
               onFocus={() => setShowDropdown(true)} className={input}
            />

            {showDropdown && filteredCategories.length > 0 && (
              <div className="absolute w-full bg-white border rounded-xl shadow 
                mt-1 max-h-40 overflow-y-auto z-20">
                  {filteredCategories.map((cat) => (
                    <div key={cat._id}
                      onClick={() => handleCategorySelect(cat)}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50"
                    >
                      {cat.name}
                    </div>
                  ))}
              </div>
            )}

            {showDropdown && formData.category && filteredCategories.length === 0 && (
              <div className="absolute w-full bg-white border rounded-xl shadow 
                mt-1 px-4 py-2 text-sm text-gray-500">
                New category
              </div>
            )} 
          </div>
        </div> 
      </div> 

      {/* Footer */}
      <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-200">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>
    </form>
  );
}

