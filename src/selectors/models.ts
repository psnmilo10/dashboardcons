// src/selectors/models.ts
import { stripYears } from "../utils/stripYears";

type Venta = { modelo?: string; "modelo vendido"?: string; cantidad?: number; unidades?: number };

function keyFromRow(row: Venta) {
  const raw = row.modelo ?? row["modelo vendido"] ?? "";
  return stripYears(String(raw));
}

function qtyFromRow(row: Venta) {
  return Number(row.unidades ?? row.cantidad ?? 1);
}

export function getTopModels(data: Venta[], topN = 10) {
  const acc = new Map<string, number>();
  for (const row of data) {
    const key = keyFromRow(row);
    const qty = qtyFromRow(row);
    acc.set(key, (acc.get(key) ?? 0) + qty);
  }
  return [...acc.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

export function getModelDistribution(data: Venta[]) {
  const all = getTopModels(data, Number.POSITIVE_INFINITY);
  const total = all.reduce((s, d) => s + d.value, 0) || 1;
  return all.map(d => ({
    name: d.name,
    value: d.value,
    percent: +((d.value * 100) / total).toFixed(2),
  }));
}
