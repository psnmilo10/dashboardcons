import React from 'react';
import { User, Crown, Medal, Award } from 'lucide-react';

interface SalesPersonRankingProps {
  salesByPerson: { [key: string]: number };
}

export function SalesPersonRanking({ salesByPerson }: SalesPersonRankingProps) {
  const sortedSalesPeople = Object.entries(salesByPerson)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Award className="w-5 h-5 text-orange-500" />;
      default: return <User className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'from-yellow-500 to-yellow-600';
      case 1: return 'from-gray-400 to-gray-500';
      case 2: return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Ranking de Vendedores</h3>
      </div>
      
      <div className="space-y-4">
        {sortedSalesPeople.map(([name, sales], index) => (
          <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${getRankColor(index)} rounded-full flex items-center justify-center`}>
                {getRankIcon(index)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{name}</h4>
                <p className="text-sm text-gray-500">Puesto #{index + 1}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${sales.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}