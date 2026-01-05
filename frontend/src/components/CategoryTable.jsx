import { useState, Fragment } from "react";
import api from "../api/axios";
import EditCategory from "./EditCategory";

export default function CategoryTable({
  categories = [],
  loading,
  refreshCategories,
}) {
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      refreshCategories();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete category");
    }
  };

  if (loading) {
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
          {/* TABLE HEADER */}
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Category Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Subcategories</th>
              <th className="px-4 py-3 text-center">Add</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* EMPTY STATE */}
            {categories.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No categories found
                </td>
              </tr>
            )}

            {/* CATEGORY ROWS */}
            {categories.map((cat) => (
              <Fragment key={cat._id}>
                <tr className="border-t hover:bg-gray-50 transition">
                  {/* IMAGE */}
                  <td className="px-4 py-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/categories/image/${cat._id}`}
                      alt={cat.name}
                      className="w-12 h-12 rounded-lg object-contain bg-gray-100 p-1"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.alt = "No image";
                      }}
                    />
                  </td>

                  {/* NAME */}
                  <td className="px-4 py-3 font-medium capitalize">
                    {cat.name}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="px-4 py-3 text-gray-600">
                    {cat.description || "—"}
                  </td>

                  {/* VIEW SUBCATEGORY */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        setOpenCategoryId(
                          openCategoryId === cat._id ? null : cat._id
                        )
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {openCategoryId === cat._id ? "Hide" : "View"}
                    </button>
                  </td>

                  {/* ADD SUBCATEGORY */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => alert("Subcategory modal here")}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
                    >
                      + Add
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setEditCategoryId(cat._id)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {/* SUBCATEGORY SECTION */}
                {openCategoryId === cat._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="border-l-4 border-blue-500 pl-4 text-gray-500 text-sm">
                        Subcategories will be loaded here
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT CATEGORY MODAL */}
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
    </>
  );
}


