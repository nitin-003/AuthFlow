export default function StatusBadge({ status }) {
  const colors = {
    IN_STOCK: "green",
    LOW_STOCK: "orange",
    OUT_OF_STOCK: "red",
  };

  return (
    <span style={{
      padding: "4px 8px",
      borderRadius: "6px",
      color: "white",
      background: colors[status],
      fontSize: "12px"
    }}>
      {status}
    </span>
  );
}


