import React, { useState, useRef } from 'react';
import './FileDropZone.scss';

interface FileDropZoneProps {
  onFileDrop: (files: File[]) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileDrop }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(true);
    if (!visible) {
      setVisible(true); 
    }
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
    setVisible(false); 
  };

  const handleFiles = (droppedFiles: File[]) => {
    const validFiles = droppedFiles.filter(file => validateFile(file));
    setFiles([...files, ...validFiles]);
    onFileDrop(validFiles);
  };

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert(`File type not supported: ${file.type}`);
      return false;
    }
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    handleFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="file-drop-container">
      {visible && (
        <div
          className={`file-drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {files.length === 0 ? (
            <p>Drag & drop files here, or click to select files</p>
          ) : (
            <div className="file-preview">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="file-thumbnail" />
                  ) : (
                    <div className="file-icon">📄</div>
                  )}
                  <span>{file.name}</span>
                  <button onClick={() => removeFile(index)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button className="manual-toggle-button" onClick={toggleVisibility}>
        {visible ? 'Hide Upload' : 'Upload Files'}
      </button>
    </div>
  );
};

export default FileDropZone;