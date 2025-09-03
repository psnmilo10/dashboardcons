import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Percent, 
  ShoppingBag,
  BarChart3,
  RefreshCw
} from 'lucide-react';

import { MetricCard } from './components/MetricCard';
import { SalesChart } from './components/SalesChart';
import { TopProductsTable } from './components/TopProductsTable';
import { SalesPersonRanking } from './components/SalesPersonRanking';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

import { SalesRecord, SalesMetrics } from './types/SalesData';

// ⬇️ unificamos los imports del service, incluyendo computeSalesTotals
import { fetchSalesData, calculateMetrics, computeSalesTotals } from './services/salesDataService';

function App() {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchSalesData();
      
      if (data.length === 0) {
        setError(true);
        return;
      }
      
      setSalesData(data);
      const calculatedMetrics = calculateMetrics(data);
      setMetrics(calculatedMetrics);
    } catch (err) {
      console.error('Error loading sales data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !metrics) {
    return <ErrorMessage onRetry={loadSalesData} />;
  }

  // Formateador de dinero para las tarjetas
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ Cálculo real de Totales vs. Mes actual (usa las filas crudas salesData)
  const { totalSales, monthlySales } = computeSalesTotals(salesData, new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Ventas</h1>
                <p className="text-sm text-gray-600">Dashboard de métricas y análisis</p>
              </div>
            </div>
            <button
              onClick={loadSalesData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Ventas Totales"
            value={formatCurrency(totalSales)}       {/* ← ahora usando computeSalesTotals */}
            icon={DollarSign}
            color="blue"
          />
          <MetricCard
            title="Ventas del Mes"
            value={formatCurrency(monthlySales)}     {/* ← ahora usando computeSalesTotals */}
            icon={Calendar}
            color="green"
          />
          <MetricCard
            title="Margen Promedio"
            value={`${metrics.margenPromedio.toFixed(1)}%`}
            icon={Percent}
            color="orange"
          />
          <MetricCard
            title="Modelos Únicos"
            value={metrics.modelosMasVendidos.length.toString()}
            icon={ShoppingBag}
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Vendedor</h3>
            <SalesChart metrics={metrics} type="bar" />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Modelos</h3>
            <div className="h-64">
              <SalesChart metrics={metrics} type="doughnut" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SalesPersonRanking salesByPerson={metrics.ventasPorVendedor} />
          </div>
          
          <div>
            <TopProductsTable models={metrics.modelosMasVendidos} />
          </div>
        </div>

        {/* Data Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Datos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 font-medium">Total de Registros</p>
              <p className="text-2xl font-bold text-blue-900">{salesData.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-600 font-medium">Vendedores Activos</p>
              <p className="text-2xl font-bold text-green-900">
                {Object.keys(metrics.ventasPorVendedor).length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-600 font-medium">Modelos Diferentes</p>
              <p className="text-2xl font-bold text-purple-900">
                {metrics.modelosMasVendidos.length}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            Panel de Control de Ventas - Actualizado automáticamente desde Google Sheets
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

