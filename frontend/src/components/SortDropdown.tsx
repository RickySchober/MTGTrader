import * as React from "react";

interface SortDropdownProps {
  sortField: string;
  setSortField: (field: string) => void;
  ascending: boolean;
  setAscending: (asc: boolean) => void;
}

const SortDropown: React.FC<SortDropdownProps> = ({
  sortField,
  setSortField,
  ascending,
  setAscending,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "10px 0",
      }}
    >
      {/* Dropdown */}
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        style={{
          fontSize: 19,
          fontWeight: 550,
          padding: "10px 20px 10px 20px",
          borderRadius: "4px",
        }}
      >
        <option value="nameSort">Name</option>
        <option value="price">Price</option>
        <option value="dateSort">Date Added</option>
        <option value="setName"> Set Name</option>
      </select>

      {/* Asc/Desc Toggle Button */}
      <button
        onClick={() => setAscending(!ascending)}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ opacity: ascending ? 1 : 0.25 }}>↑</span>
        <span style={{ opacity: ascending ? 0.25 : 1 }}>↓</span>
      </button>
    </div>
  );
};
export default SortDropown;
