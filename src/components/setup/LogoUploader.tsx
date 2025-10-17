'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface LogoUploaderProps {
  onUpload: (file: File) => Promise<string>; // Retorna URL
  currentLogo?: string;
  onRemove?: () => void;
  className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const ALLOWED_EXTENSIONS = ['PNG', 'JPG', 'JPEG', 'WEBP', 'SVG'];

export function LogoUploader({
  onUpload,
  currentLogo,
  onRemove,
  className = ''
}: LogoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar archivo
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Formato no permitido. Solo: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `Archivo muy grande (${sizeMB}MB). Máximo: 5MB`
      };
    }

    return { valid: true };
  };

  // Procesar archivo
  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setUploadSuccess(false);

    // Validar
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    setIsUploading(true);
    try {
      const url = await onUpload(file);
      setPreview(url);
      setUploadSuccess(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Error al subir el logo. Intenta de nuevo.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  // Manejar cambio de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Manejar drag & drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  // Abrir selector de archivos
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Remover logo
  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-[#FF6B35] bg-orange-50'
            : preview
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-[#FF6B35] hover:bg-orange-50'
          }
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {/* Preview del logo */}
          {preview ? (
            <div className="relative">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white border-2 border-gray-200">
                <Image
                  src={preview}
                  alt="Logo preview"
                  fill
                  className="object-contain p-2"
                />
              </div>
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center
              ${isDragging ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-400'}
              transition-colors duration-200
            `}>
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <ImageIcon className="h-8 w-8" />
              )}
            </div>
          )}

          {/* Texto */}
          <div className="space-y-2">
            {isUploading ? (
              <p className="text-sm text-gray-600">Subiendo logo...</p>
            ) : preview ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm font-medium">Logo cargado</p>
                </div>
                <p className="text-xs text-gray-500">Haz clic para cambiar</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-[#FF6B35]">Haz clic para subir</span> o arrastra tu logo
                </p>
                <p className="text-xs text-gray-500">
                  {ALLOWED_EXTENSIONS.join(', ')} - Máx. 5MB
                </p>
              </>
            )}
          </div>

          {/* Icono de upload */}
          {!preview && !isUploading && (
            <Upload className={`h-6 w-6 ${isDragging ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Mensaje de éxito */}
      {uploadSuccess && (
        <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>Logo subido exitosamente</p>
        </div>
      )}

      {/* Consejos */}
      <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium text-gray-700">💡 Consejos:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>Usa un fondo transparente (PNG/SVG) para mejor resultado</li>
          <li>Tamaño recomendado: 500x500px o superior</li>
          <li>El logo se mostrará en tu página de reservas</li>
        </ul>
      </div>
    </div>
  );
}



