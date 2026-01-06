import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import CategoryTable from "../components/CategoryTable";
import AddCategory from "../components/AddCategory";
import api from "../api/axios";

function Category(){
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/categories");
      setCategories(res.data);
    } 
    catch(err){
      console.error("Failed to fetch categories", err);
      setError("Failed to load categories");
    } 
    finally{
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="relative mb-8 flex flex-wrap items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} 
          className="flex items-center gap-1 bg-gray-200 px-3 py-1.5 
          rounded-lg text-sm hover:bg-gray-300"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-blue-600">
          Category Management
        </h2>

        {/* Open Modal */}
        <button onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 
          rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <CategoryTable
        categories={categories}
        loading={loading}
        refreshCategories={fetchCategories}
      />

      {/* Add Category Modal */}
      {openAddModal && (
        <AddCategory
          onClose={() => setOpenAddModal(false)}
          onSuccess={() => {
            setOpenAddModal(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}

export default Category;


