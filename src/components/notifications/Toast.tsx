import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function showToast(message: string, type: 'success' | 'error' | 'info') {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`}>
      <p className="flex items-center">
        {type === 'success' && <CheckCircle2 className="h-5 w-5 mr-2" />}
        {type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
        {type === 'info' && <Info className="h-5 w-5 mr-2" />}
        {message}
      </p>
    </div>
  );
}