import { SalesRecord, SalesMetrics } from '../types/SalesData';
import { parseCSV } from '../utils/csvParser';
import { parseISO, isValid, format, isSameMonth } from 'date-fns';

// --- Parsear dinero tipo "69.000$" → 69000
export function parseMoneyToNumber(v: any): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (!v) return 0;
  const digits = String(v).replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

// --- Normaliza "dd/MM" o "dd/MM/yyyy" a Date (America/Lima por defecto)
export function parsePeruDate(input: any, now: Date = new Date()): Date | null {
  if (!input) return null;

  if (input instanceof Date && !isNaN(input.valueOf())) return input;

  const s = String(input).trim();

  // dd/MM/yyyy
  let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let d = Number(m[1]), mo = Number(m[2]) - 1, y = Number(m[3]);
    if (y < 100) y += 2000; // por si ponen 25
    const dt = new Date(y, mo, d);
    return isNaN(dt.valueOf()) ? null : dt;
  }

  // dd/MM (sin año) → asumimos año actual
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) {
    const d = Number(m[1]), mo = Number(m[2]) - 1, y = now.getFullYear();
    const dt = new Date(y, mo, d);
    return isNaN(dt.valueOf()) ? null : dt;
  }

  return null;
}

export function isSameMonthAndYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}


const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1OtgpEgn9R58bqeEE9AjbxWJev4sBR12KP6p_DcOfg7U/export?format=csv&gid=0';

export async function fetchSalesData(): Promise<SalesRecord[]> {
  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map(row => ({
      vendedor: row[0] || '',
      modeloVendido: row[1] || '',
      año: parseInt(row[2]) || new Date().getFullYear(),
      cantidad: parseFloat(row[3]) || 0,
      costo: parseFloat(row[4]) || 0,
      precioLista: parseFloat(row[5]) || 0,
      precioVenta: parseFloat(row[6]) || 0,
      fecha: (() => {
        if (!row[7]) return new Date();
        const parsedDate = parseISO(row[7]);
        return isValid(parsedDate) ? parsedDate : new Date();
      })(),
    }));
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return [];
  }
}

export function calculateMetrics(salesData: SalesRecord[]): SalesMetrics {
  const totalVentas = salesData.reduce((sum, record) => 
    sum + (record.precioVenta * record.cantidad), 0
  );
  
  const totalCosto = salesData.reduce((sum, record) => 
    sum + (record.costo * record.cantidad), 0
  );
  
  const totalMargen = totalVentas - totalCosto;
  const margenPromedio = totalVentas > 0 ? (totalMargen / totalVentas) * 100 : 0;
  
  // Ventas del mes actual
  const currentDate = new Date();
  const ventasDelMes = salesData
    .filter(record => isSameMonth(record.fecha, currentDate))
    .reduce((sum, record) => sum + (record.precioVenta * record.cantidad), 0);
  
  // Ventas por vendedor
  const ventasPorVendedor: { [key: string]: number } = {};
  salesData.forEach(record => {
    const ventas = record.precioVenta * record.cantidad;
    ventasPorVendedor[record.vendedor] = (ventasPorVendedor[record.vendedor] || 0) + ventas;
  });
  
  // Modelos más vendidos (sin años)
  const modelosCount: { [key: string]: number } = {};
  salesData.forEach(record => {
    // Solo usar el modelo, ignorar el año
    const modelo = record.modeloVendido;
    modelosCount[modelo] = (modelosCount[modelo] || 0) + record.cantidad;
  });
  
  const modelosMasVendidos = Object.entries(modelosCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([modelo, cantidad]) => ({ modelo, cantidad }));
  
  return {
    totalVentas,
    totalMargen,
    margenPromedio,
    ventasDelMes,
    ventasPorVendedor,
    modelosMasVendidos,
  };
}
