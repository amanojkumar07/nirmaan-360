import React from "react";

export function SkeletonBox({ width = "100%", height = "20px", style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        ...style
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: "20px" }}>
      <SkeletonBox width="40%" height="16px" style={{ marginBottom: "12px" }} />
      <SkeletonBox width="70%" height="28px" style={{ marginBottom: "16px" }} />
      <SkeletonBox width="100%" height="60px" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="table-responsive" style={{ padding: "16px" }}>
      <SkeletonBox width="30%" height="20px" style={{ marginBottom: "16px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: "flex", gap: "12px" }}>
            {Array.from({ length: cols }).map((_, c) => (
              <SkeletonBox key={c} width={`${100 / cols}%`} height="18px" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
