import { useEffect, useState } from "react";
import api from "../api/axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function SubCategoryList({ categoryId }) {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubCategories = async () => {
    try{
      setLoading(true);
      const res = await api.get(`/subcategories?categoryId=${categoryId}`);
      setSubcategories(res.data);
    } 
    catch(err){
      toast.error("Failed to load subcategories");
    } 
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [categoryId]);

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this subcategory permanently?")) return;

    try{
      await api.delete(`/subcategories/${id}`);
      toast.success("Subcategory deleted");
      fetchSubCategories();
    } 
    catch{
      toast.error("Delete failed");
    }
  };

  if(loading){
    return (
      <p className="text-sm text-gray-500 py-2">Loading subcategories...</p>
    );
  }

  if(subcategories.length === 0){
    return (
      <p className="text-sm text-gray-400 py-2">No subcategories found</p>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {subcategories.map((sub) => (
        <div key={sub._id}
          className="flex items-center justify-between rounded-lg 
          border bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
        >
          <div>
            <p className="font-medium text-gray-800 capitalize">
              {sub.name}
            </p>
            {sub.description && (
              <p className="text-xs text-gray-500">
                {sub.description}
              </p>
            )}
          </div>

          <button
            onClick={() => handleDelete(sub._id)}
            className="text-red-600 hover:text-red-700"
            title="Delete subcategory"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}


