import { create } from 'zustand';
import { File, FileFormData, FileStatus } from '../types/file';
import { fileService } from '../services/api';
import type { File as ApiFile } from '../types/api';

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
  addFile: (file: FileFormData) => Promise<void>;
  updateFile: (id: number, file: FileFormData) => Promise<void>;
  deleteFile: (id: number) => Promise<void>;
  fetchFiles: () => Promise<void>;
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

  fetchFiles: async () => {
    try {
      console.log('Store - Iniciando fetchFiles');
      const files = await fileService.getAll();
      console.log('Store - Archivos recibidos:', files);
      set({ files: files as File[] });
    } catch (error) {
      console.error('Store - Error al obtener archivos:', error);
      throw error;
    }
  },

  addFile: async (fileData) => {
    try {
      console.log('Store - Creando nuevo archivo:', fileData);
      const newFile = await fileService.create({
        ...fileData,
        created_by: 1 // Por ahora hardcodeamos el usuario
      });
      console.log('Store - Archivo creado:', newFile);
      set((state) => ({
        files: [newFile as File, ...state.files],
      }));
    } catch (error) {
      console.error('Store - Error al crear archivo:', error);
      throw error;
    }
  },

  updateFile: async (id: number, fileData: FileFormData) => {
    try {
      console.log('Store - Actualizando archivo:', id, fileData);
      const updatedFile = await fileService.update(id, fileData);
      console.log('Store - Archivo actualizado:', updatedFile);
      set((state) => ({
        files: state.files.map((file) =>
          file.id === id ? (updatedFile as File) : file
        ),
      }));
    } catch (error) {
      console.error('Store - Error al actualizar archivo:', error);
      throw error;
    }
  },

  deleteFile: async (id: number) => {
    try {
      console.log('Store - Eliminando archivo:', id);
      await fileService.delete(id);
      console.log('Store - Archivo eliminado');
      set((state) => ({
        files: state.files.filter((file) => file.id !== id),
      }));
    } catch (error) {
      console.error('Store - Error al eliminar archivo:', error);
      throw error;
    }
  },

  getFilteredFiles: () => {
    const state = get();
    let filteredFiles = [...state.files];

    // Aplicar filtros de estado
    if (state.filters.status.length > 0) {
      filteredFiles = filteredFiles.filter((file) =>
        state.filters.status.includes(file.estado)
      );
    }

    // Aplicar filtros de fecha
    if (state.filters.dateRange.start) {
      filteredFiles = filteredFiles.filter(
        (file) => file.fecha >= state.filters.dateRange.start!
      );
    }
    if (state.filters.dateRange.end) {
      filteredFiles = filteredFiles.filter(
        (file) => file.fecha <= state.filters.dateRange.end!
      );
    }

    // Aplicar búsqueda
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filteredFiles = filteredFiles.filter(
        (file) =>
          file.numeroExpediente.toLowerCase().includes(searchLower) ||
          file.caratula.toLowerCase().includes(searchLower) ||
          (file.observaciones?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Aplicar ordenamiento
    if (state.sortConfig.key) {
      filteredFiles.sort((a, b) => {
        if (!state.sortConfig.key) return 0;
        
        const aValue = a[state.sortConfig.key];
        const bValue = b[state.sortConfig.key];
        
        if (aValue === null || bValue === null || aValue === undefined || bValue === undefined) return 0;
        
        const direction = state.sortConfig.direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * direction;
        }

        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      });
    }

    return filteredFiles;
  },
}));