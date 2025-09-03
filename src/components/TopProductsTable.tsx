import React from 'react';
import { Package, TrendingUp } from 'lucide-react';

interface Model {
  modelo: string;
  cantidad: number;
}

interface TopProductsTableProps {
  models: Model[];
}

export function TopProductsTable({ models }: TopProductsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Modelos Más Vendidos</h3>
      </div>
      
      <div className="space-y-4">
        {models.map((model, index) => (
          <div key={model.modelo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-medium text-gray-700 shadow-sm">
                {index + 1}
              </div>
              <span className="font-medium text-gray-900">{model.modelo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">{model.cantidad}</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}