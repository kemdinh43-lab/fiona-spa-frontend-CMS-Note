export const formatVnd = (value: number): string =>
  `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0
  }).format(value)} VNĐ`;

export const formatUsd = (value?: number): string | null =>
  typeof value === "number" ? `$${value}` : null;
