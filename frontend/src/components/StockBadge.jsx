export default function StockBadge({ status }) {
  const colorMap = {
    IN_STOCK: "green",
    LOW_STOCK: "orange",
    OUT_OF_STOCK: "red",
  };

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "6px",
        color: "white",
        backgroundColor: colorMap[status] || "gray",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}


