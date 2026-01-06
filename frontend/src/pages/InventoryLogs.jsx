import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function InventoryLogs(){
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    try{
      setLoading(true);
      const res = await api.get("/products/inventory-logs");
      setLogs(res.data || []);
    } 
    catch(err){
      if(err.response?.status === 401){
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } 
      else{
        toast.error(
          err.response?.data?.message || "Failed to load inventory logs"
        );
      }
    } 
    finally{
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if(loading){
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading inventory logs...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-0">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1 bg-gray-100 text-gray-700
              px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <h2
            className="text-xl sm:text-2xl font-bold
              bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
          >
            Inventory Logs
          </h2>

          <div className="w-[70px]" />
        </div>

        <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r
          from-blue-500 to-purple-500 mx-auto" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-center">Type</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Performed By</th>
                <th className="p-3 text-center">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    No inventory logs found
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log._id}
                    className={`border-t transition
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                  >
                    {/* Product */}
                    <td className="p-3 font-medium max-w-[200px] truncate">
                      {log.product?.name || (
                        <span className="text-gray-500 italic">
                          {log.productName} (Deleted)
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1
                          rounded-full text-xs font-semibold
                          ${
                            log.type === "IN"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {log.type === "IN" ? (
                          <ArrowDownLeft size={14} />
                        ) : (
                          <ArrowUpRight size={14} />
                        )}
                        {log.type}
                      </span>
                    </td>

                    {/* Qty */}
                    <td className="p-3 text-center font-semibold">
                      {log.quantity}
                    </td>

                    {/* Reason */}
                    <td className="p-3 text-gray-700 max-w-[220px] truncate">
                      {log.reason || "-"}
                    </td>

                    {/* User */}
                    <td className="p-3">
                      {log.performedBy?.name || "System"}
                    </td>

                    {/* Date */}
                    <td className="p-3 text-center text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleDateString()}{" "}
                      <br />
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

