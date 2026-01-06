import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import EditSubCategory from "./EditSubCategory";

export default function SubCategoryList({ categoryId }){
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSub, setEditSub] = useState(null);

   const fetchSubCategories = useCallback(async () => {
    try{
      setLoading(true);
      const res = await api.get(`/subcategories?categoryId=${categoryId}`);
      setSubcategories(res.data);
    } 
    catch{
      toast.error("Failed to load subcategories");
    } 
    finally{
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if(categoryId) fetchSubCategories();
  }, [categoryId, fetchSubCategories]);

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
      <p className="py-2 text-sm text-gray-500">
        Loading subcategories...
      </p>
    );
  }

  if(subcategories.length === 0){
    return (
      <p className="py-2 text-sm text-gray-400">
        No subcategories found
      </p>
    );
  }

  return (
    <>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full overflow-hidden rounded-lg border border-gray-200">
          {/* Table Head */}
          <thead className="bg-gray-100 text-left">
            <tr className="text-sm text-gray-600">
              <th className="w-16 px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="w-24 px-4 py-2 text-center">Edit</th>
              <th className="w-24 px-4 py-2 text-center">Delete</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {subcategories.map((sub) => (
              <tr key={sub._id}
                className="border-t text-sm hover:bg-gray-50"
              >
                {/* Image */}
                <td className="px-4 py-2">
                  <img
                    src={`http://localhost:5000/subcategories/image/${sub._id}?t=${sub.updatedAt || ""}`}
                    alt={sub.name}
                    onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                    className="h-10 w-10 rounded-md border object-cover"
                  />
                </td>

                {/* Name */}
                <td className="px-4 py-2 font-medium capitalize text-gray-800">
                  {sub.name}
                </td>

                {/* Description */}
                <td className="max-w-md px-4 py-2 text-gray-500 truncate">
                  {sub.description || "-"}
                </td>

                {/* Edit */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setEditSub(sub)}
                    className="min-w-[70px] rounded-md bg-indigo-200 px-4 py-1.5 text-xs 
                    font-semibold text-indigo-90 transition-colors duration-200 hover:bg-indigo-300"
                  >
                    Edit
                  </button>
                </td>

                {/* Delete */}
                <td className="px-4 py-2 text-center">
                  <button onClick={() => handleDelete(sub._id)}
                    className="min-w-[70px] rounded-md bg-red-200 px-4 py-1.5
                      text-xs font-semibold text-red-900
                      transition-colors duration-200 hover:bg-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editSub && (
        <EditSubCategory subcategory={editSub}
          onClose={() => setEditSub(null)}
          onSuccess={fetchSubCategories}
        />
      )}
    </>
  );
}


