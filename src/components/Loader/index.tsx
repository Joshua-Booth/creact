import React from "react";

export default function Loader() {
  return (
    <div title="Loader" role="region" className="loader mx-auto pt-5">
      <div className="mx-auto" style={{ width: "100px", height: "100px" }}>
        <div
          className="spinner"
          style={{
            border: "8px solid #f3f3f3",
            borderTop: "8px solid #3876e4",
            borderRadius: "50%",
            width: "100px",
            height: "100px",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    </div>
  );
}
