import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { File, FileFormData } from '../../types/file';
import { useFileStore } from '../../store/files';
import FileList from '../../components/files/FileList';
import FileForm from '../../components/files/FileForm';
import FileSearch from '../../components/files/FileSearch';

function Files() {
  const [showForm, setShowForm] = useState(false);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const { addFile, updateFile, deleteFile, getFilteredFiles, fetchFiles } = useFileStore();
  const filteredFiles = getFilteredFiles();

  useEffect(() => {
    console.log('Files - Iniciando fetchFiles');
    fetchFiles().catch(error => {
      console.error('Error al cargar expedientes:', error);
    });
  }, [fetchFiles]);

  console.log('Files - filteredFiles:', filteredFiles);

  const handleSubmit = async (data: FileFormData) => {
    try {
      if (editingFile) {
        console.log('Files - Actualizando expediente:', editingFile.id, data);
        await updateFile(editingFile.id, data);
      } else {
        console.log('Files - Creando nuevo expediente:', data);
        await addFile(data);
      }
      setShowForm(false);
      setEditingFile(null);
    } catch (error) {
      console.error('Error al guardar expediente:', error);
      alert('Error al guardar el expediente');
    }
  };

  const handleEdit = (file: File) => {
    setEditingFile(file);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este expediente?')) {
      try {
        await deleteFile(id);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el expediente');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expedientes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestione los expedientes del sistema
          </p>
        </div>
        <button
          onClick={() => {
            setEditingFile(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Expediente
        </button>
      </div>

      {!showForm && <FileSearch />}

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6">
          <FileForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingFile(null);
            }}
            initialData={editingFile || undefined}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <FileList
            files={filteredFiles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

export default Files;