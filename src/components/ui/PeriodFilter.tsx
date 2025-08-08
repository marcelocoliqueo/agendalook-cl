'use client';

import { useState } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Download, Filter } from 'lucide-react';
import { Button } from './Button';

export type PeriodType = 'week' | 'month' | 'year';

interface PeriodFilterProps {
  onPeriodChange: (period: PeriodType, startDate: Date, endDate: Date) => void;
  onExportPDF: (period: PeriodType, startDate: Date, endDate: Date) => void;
  currentPeriod: PeriodType;
}

export function PeriodFilter({ onPeriodChange, onExportPDF, currentPeriod }: PeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(currentPeriod);

  const getPeriodDates = (period: PeriodType) => {
    const now = new Date();
    
    switch (period) {
      case 'week':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }), // Lunes como inicio de semana
          end: endOfWeek(now, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case 'year':
        return {
          start: startOfYear(now),
          end: endOfYear(now)
        };
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
    }
  };

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    const { start, end } = getPeriodDates(period);
    onPeriodChange(period, start, end);
  };

  const handleExportPDF = () => {
    const { start, end } = getPeriodDates(selectedPeriod);
    onExportPDF(selectedPeriod, start, end);
  };

  const { start, end } = getPeriodDates(selectedPeriod);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 font-poppins">Período:</span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={selectedPeriod === 'week' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange('week')}
              className="text-xs"
            >
              Semana
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange('month')}
              className="text-xs"
            >
              Mes
            </Button>
            <Button
              variant={selectedPeriod === 'year' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange('year')}
              className="text-xs"
            >
              Año
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="font-poppins">
              {format(start, 'dd/MM/yyyy', { locale: es })} - {format(end, 'dd/MM/yyyy', { locale: es })}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="text-xs"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
} 