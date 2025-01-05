import { useFileStore } from '../store/files';
import { File } from '../types/File';

export function useCompletedFiles(): File[] {
  const files = useFileStore((state) => state.files);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return files.filter(file => {
    const fileDate = new Date(file.created_at);
    fileDate.setHours(0, 0, 0, 0);
    return fileDate.getTime() === today.getTime() && file.estado === 'completado';
  });
}
