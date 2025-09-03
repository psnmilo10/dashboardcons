export interface SalesRecord {
  vendedor: string;
  modeloVendido: string;
  año: number;
  cantidad: number;
  costo: number;
  precioLista: number;
  precioVenta: number;
  fecha: Date;
}

export interface SalesMetrics {
  totalVentas: number;
  totalMargen: number;
  margenPromedio: number;
  ventasDelMes: number;
  ventasPorVendedor: { [key: string]: number };
  modelosMasVendidos: Array<{ modelo: string; cantidad: number }>;
}