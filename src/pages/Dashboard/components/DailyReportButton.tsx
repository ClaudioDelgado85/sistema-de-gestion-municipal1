import React from 'react';
import { FileDown } from 'lucide-react';
import { useCompletedToday } from '../../../hooks/useCompletedToday';
import { generateDailyReport } from '../../../utils/pdfGenerator';

function DailyReportButton() {
  const completedToday = useCompletedToday();

  const handleGenerateReport = () => {
    const doc = generateDailyReport(completedToday);
    doc.save('informe-diario.pdf');
  };

  return (
    <button
      onClick={handleGenerateReport}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <FileDown className="h-5 w-5 mr-2" />
      Generar Informe del Día
    </button>
  );
}

export default DailyReportButton;