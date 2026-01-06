import { useState, Fragment } from "react";
import api from "../api/axios";
import EditCategory from "./EditCategory";
import SubCategoryList from "./SubCategoryList";
import AddSubCategory from "./AddSubCategory";

export default function CategoryTable({ 
  categories = [], loading, refreshCategories }){
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [openAddSubCategoryId, setOpenAddSubCategoryId] = useState(null);
  const [refreshSubKey, setRefreshSubKey] = useState(0);

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this category?")) return;

    try{
      await api.delete(`/categories/${id}`);
      refreshCategories();
    } 
    catch{
      alert("Failed to delete category");
    }
  };

  if(loading){
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading categories...
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-2xl shadow border">
        <table className="w-full text-sm text-gray-700">
          {/* Header */}
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">View Subcategories</th>
              <th className="px-4 py-3 text-center">Add SubCategory</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No categories found
                </td>
              </tr>
            )}

            {categories.map((cat) => (
              <Fragment key={cat._id}>
                <tr className="border-t hover:bg-gray-50 transition">
                  {/* Image */}
                  <td className="px-4 py-3">
                    <img
                      src={`http://localhost:5000/categories/image/${cat._id}`}
                      alt={cat.name}
                      className="w-12 h-12 rounded-lg object-contain bg-gray-100 p-1"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium capitalize">
                    {cat.name}
                  </td>

                  {/* Description*/}
                  <td className="px-4 py-3 text-gray-600">
                    {cat.description || "—"}
                  </td>

                  {/* View */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        setOpenCategoryId(
                          openCategoryId === cat._id ? null : cat._id
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-md
                        text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200
                        transition"
                    >
                      {openCategoryId === cat._id ? "Hide" : "View"}
                    </button>
                  </td>

                  {/* Add SubCategory */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setOpenAddSubCategoryId(cat._id);
                        setOpenCategoryId(cat._id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-md
                        bg-emerald-500 text-white text-xs font-semibold
                        hover:bg-emerald-700 shadow-sm transition"
                    >
                      + Add
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditCategoryId(cat._id)}
                        className="inline-flex items-center px-3 py-2 rounded-md
                          text-xs font-medium text-indigo-700 bg-indigo-100 
                          hover:bg-indigo-200 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="inline-flex items-center px-3 py-2 rounded-md
                          text-xs font-medium text-red-700 bg-red-100
                          hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {/* SubCategory Dropdown */}
                {openCategoryId === cat._id && (
                  <tr className="bg-gray-50 animate-[fadeIn_0.15s_ease-out]">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="rounded-xl border border-blue-100 
                        bg-blue-50/50 p-4 shadow-inner">
                        <h4 className="mb-3 text-sm font-semibold text-blue-700">
                          SubCategories
                        </h4>
                        <SubCategoryList
                          key={refreshSubKey}
                          categoryId={cat._id}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Category */}
      {editCategoryId && (
        <EditCategory
          id={editCategoryId}
          onClose={() => setEditCategoryId(null)}
          onSuccess={() => {
            setEditCategoryId(null);
            refreshCategories();
          }}
        />
      )}

      {/* Add SubCategory */}
      {openAddSubCategoryId && (
        <AddSubCategory
          categoryId={openAddSubCategoryId}
          onClose={() => setOpenAddSubCategoryId(null)}
          onSuccess={() => {
            setOpenAddSubCategoryId(null);
            setRefreshSubKey((k) => k + 1);
          }}
        />
      )}
    </>
  );
}

