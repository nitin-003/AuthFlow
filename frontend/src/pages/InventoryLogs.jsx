import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function InventoryLogs(){
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try{
      const res = await api.get("/products/inventory-logs");
      setLogs(res.data);
    } 
    catch(err){
      setError(err.response?.data?.message || "Failed to load logs");
    } 
    finally{
      setLoading(false);
    }
  };

  if(loading){
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading inventory logs...
      </div>
    );
  }

  if(error){
    return (
      <p className="text-center py-10 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* PAGE HEADER */}
      <div className="mb-8">

        <div className="flex items-center justify-between">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1
                       bg-gray-100 text-gray-700
                       px-3 py-1.5 rounded-lg text-sm
                       hover:bg-gray-400 transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold
                         bg-gradient-to-r from-blue-600 to-purple-600
                         text-transparent bg-clip-text">
            Inventory Logs
          </h2>

          {/* Spacer for symmetry */}
          <div className="w-[70px]" />
        </div>

        {/* Divider */}
        <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto" />
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
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
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No inventory logs found
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={log._id}
                    className={`border-t transition
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      hover:bg-blue-50`}
                  >
                    <td className="p-3 font-medium">
                      {log.product?.name || (
                        <span className="text-gray-400 italic">
                          Deleted Product
                        </span>
                      )}
                    </td>

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

                    <td className="p-3 text-center font-semibold">
                      {log.quantity}
                    </td>

                    <td className="p-3 text-gray-700">
                      {log.reason}
                    </td>

                    <td className="p-3">
                      {log.performedBy?.name || "System"}
                    </td>

                    <td className="p-3 text-center text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleString()}
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



