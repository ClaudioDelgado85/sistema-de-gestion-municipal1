import { create } from 'zustand';
import { File, FileFormData, FileStatus } from '../types/file';

interface FileFilters {
  status: FileStatus[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

interface SortConfig {
  key: keyof File | null;
  direction: 'asc' | 'desc';
}

interface FileState {
  files: File[];
  filters: FileFilters;
  sortConfig: SortConfig;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<FileFilters>) => void;
  setSortConfig: (config: SortConfig) => void;
  addFile: (file: FileFormData) => void;
  updateFile: (id: string, file: FileFormData) => void;
  deleteFile: (id: string) => void;
  getFilteredFiles: () => File[];
}

const initialFilters: FileFilters = {
  status: [],
  dateRange: {
    start: null,
    end: null,
  },
};

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  filters: initialFilters,
  sortConfig: { key: null, direction: 'asc' },
  searchTerm: '',

  setSearchTerm: (term) => set({ searchTerm: term }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSortConfig: (config) =>
    set(() => ({
      sortConfig: config,
    })),

  addFile: (fileData) =>
    set((state) => ({
      files: [
        ...state.files,
        {
          ...fileData,
          id: Date.now().toString(),
          fecha: fileData.fecha,
          fechaSalida: fileData.fechaSalida || undefined,
          estado: fileData.fechaSalida ? 'completado' : 'en_proceso',
        },
      ],
    })),

  updateFile: (id, fileData) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id
          ? {
              ...file,
              ...fileData,
              fecha: fileData.fecha,
              fechaSalida: fileData.fechaSalida || undefined,
              estado: fileData.fechaSalida ? 'completado' : 'en_proceso',
            }
          : file
      ),
    })),

  deleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),

  getFilteredFiles: () => {
    const state = get();
    const { files, filters, searchTerm, sortConfig } = state;

    let filteredFiles = [...files];

    // Aplicar búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredFiles = filteredFiles.filter(
        (file) =>
          file.numeroExpediente.toLowerCase().includes(searchLower) ||
          file.caratula.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar filtros
    if (filters.status.length) {
      filteredFiles = filteredFiles.filter((file) =>
        filters.status.includes(file.estado)
      );
    }

    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      filteredFiles = filteredFiles.filter((file) => {
        const fileDate = new Date(file.fecha);
        fileDate.setHours(0, 0, 0, 0);
        return fileDate >= startDate;
      });
    }

    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filteredFiles = filteredFiles.filter((file) => {
        const fileDate = new Date(file.fecha);
        fileDate.setHours(0, 0, 0, 0);
        return fileDate <= endDate;
      });
    }

    // Aplicar ordenamiento
    if (sortConfig.key) {
      filteredFiles.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof File];
        const bValue = b[sortConfig.key as keyof File];
        
        // Convertir fechas a timestamps para comparación
        if (sortConfig.key === 'fecha' || sortConfig.key === 'fechaSalida') {
          const aTime = aValue ? new Date(aValue.toString()).getTime() : 0;
          const bTime = bValue ? new Date(bValue.toString()).getTime() : 0;
          return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
        }
        
        // Comparación para strings y otros tipos
        const aString = aValue?.toString() || '';
        const bString = bValue?.toString() || '';
        return sortConfig.direction === 'asc' 
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }

    return filteredFiles;
  },
}));