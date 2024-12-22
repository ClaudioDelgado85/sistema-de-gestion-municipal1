import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFileStore } from '../../store/files';
import FileList from '../../components/files/FileList';
import FileForm from '../../components/files/FileForm';
import FileSearch from '../../components/files/FileSearch';
import { File } from '../../types/file';

function Files() {
  const [showForm, setShowForm] = useState(false);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const { addFile, updateFile, deleteFile, getFilteredFiles } = useFileStore();
  const filteredFiles = getFilteredFiles();

  const handleSubmit = (data: any) => {
    if (editingFile) {
      updateFile(editingFile.id, data);
    } else {
      addFile(data);
    }
    setShowForm(false);
    setEditingFile(null);
  };

  const handleEdit = (file: File) => {
    setEditingFile(file);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este expediente?')) {
      deleteFile(id);
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