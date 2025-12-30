import { useEffect, useState } from "react";
import api from "../api/axios";

export default function InventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/inventory/logs"); // verify route
      setLogs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading inventory logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <h2>Inventory Logs</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Reason</th>
            <th>Performed By</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="6">No logs found</td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log._id}>
                <td>{log.product?.name || "Deleted Product"}</td>
                <td>{log.type}</td>
                <td>{log.quantity}</td>
                <td>{log.reason}</td>
                <td>{log.performedBy?.name || "N/A"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

