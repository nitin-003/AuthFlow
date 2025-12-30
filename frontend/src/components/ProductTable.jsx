import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProductTable({
  products,
  fetchProducts,
  setSelectedProduct,
  loading }){
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this product permanently?")) return;

    try{
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } 
    catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired");
        navigate("/login");
      } else {
        toast.error("Delete failed");
      }
    }
  };

  const updateStock = async (id, qty) => {
    try {
      await api.patch(`/products/inventory/v2/${id}`, {
        quantity: qty,
        reason: qty > 0 ? "Stock added" : "Stock removed",
      });
      toast.success("Inventory updated");
      fetchProducts();
    } 
    catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "IN_STOCK":
        return "bg-green-100 text-green-700";
      case "LOW_STOCK":
        return "bg-yellow-100 text-yellow-700";
      case "OUT_OF_STOCK":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading products...
      </p>
    );

  if (!products.length)
    return (
      <p className="text-center py-10 text-gray-400">
        No products found
      </p>
    );

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Quantity</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Category</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p._id}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Name */}
              <td className="p-4 text-center font-medium">
                {p.name}
              </td>

              {/* Price */}
              <td className="p-4 text-center">
                ₹{p.price}
              </td>

              {/* Quantity */}
              <td className="p-4 text-center font-semibold">
                {p.quantity}
              </td>

              {/* Status */}
              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                    p.status
                  )}`}
                >
                  {p.status.replace("_", " ")}
                </span>
              </td>

              {/* Category */}
              <td className="p-4 text-center">
                {p.category}
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex justify-center items-center gap-3">

                  {/* Edit */}
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="h-9 w-20 rounded-md text-sm font-medium
                    bg-blue-50 text-blue-700
                    hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  {/* Stock Control */}
                  <div className="flex items-center gap-2 px-2 h-9
                    bg-gray-100 rounded-md">
                    <button
                      disabled={p.quantity === 0}
                      onClick={() => updateStock(p._id, -1)}
                      className={`h-7 w-7 rounded text-lg font-bold
                      ${
                        p.quantity === 0
                          ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                      }`}
                    >
                      −
                    </button>

                    <span className="w-6 text-center text-sm font-semibold">
                      {p.quantity}
                    </span>

                    <button
                      onClick={() => updateStock(p._id, 1)}
                      className="h-7 w-7 rounded text-lg font-bold
                      bg-green-600 text-white hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="h-9 w-20 rounded-md text-sm font-medium
                    text-red-600 border border-red-200
                    hover:bg-red-50 transition"
                  >
                    Delete
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

