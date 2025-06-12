"use client";
import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Eye, Trash2, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function PhotoUpload({
  value = '',
  onChange,
  onLoadingChange,
  label = "Photo Upload",
  placeholder = "Upload Photo",
  maxSize = 5, // MB
  outputSize = 300, // pixels
  previewSize = 128, // pixels for preview
  required = false,
  disabled = false,
  backgroundColor = "bg-blue-50",
  borderColor = "border-blue-200",
  iconColor = "bg-blue-500",
  buttonColor = "bg-blue-600 hover:bg-blue-700",
  titleColor = "text-blue-900",
  autoGenerateFilename = false,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  quality = 0.8,
  showPreview = true,
  showFilename = true,
  acceptCamera = true
}) {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filename, setFilename] = useState('');
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Notify parent about loading state
  const updateLoadingState = useCallback((loading) => {
    setIsLoading(loading);
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [onLoadingChange]);

  // Compress and resize image
  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        const maxDimension = outputSize;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Validate file
  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Please select a valid image file. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
    }

    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file) return;

    setError('');
    updateLoadingState(true);

    try {
      validateFile(file);
      
      const processedImage = await processImage(file);
      const generatedFilename = autoGenerateFilename 
        ? `${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
        : file.name;

      setFilename(generatedFilename);
      onChange(processedImage, generatedFilename);
      
    } catch (err) {
      setError(err.message);
      console.error('Photo upload error:', err);
    } finally {
      updateLoadingState(false);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || e.dataTransfer.files.length === 0) return;
    
    handleFileSelect(e.dataTransfer.files[0]);
  };

  // Handle file input change
  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle remove
  const handleRemove = () => {
    setFilename('');
    setError('');
    onChange('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Get file size display
  const getFileSizeDisplay = () => {
    if (!value) return '';
    
    // Estimate size from base64 (rough calculation)
    const base64Length = value.length - (value.indexOf(',') + 1);
    const sizeInBytes = (base64Length * 3) / 4;
    const sizeInKB = sizeInBytes / 1024;
    
    if (sizeInKB < 1024) {
      return `${Math.round(sizeInKB)}KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)}MB`;
    }
  };

  return (
    <div className={`${backgroundColor} rounded-2xl p-6 ${borderColor} border`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${titleColor} flex items-center`}>
          <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center mr-3`}>
            <Camera className="w-4 h-4 text-white" />
          </div>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>

        {value && (
          <div className="flex items-center space-x-2">
            {showPreview && (
              <button
                onClick={() => setShowModal(true)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Preview Full Size"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <button
              onClick={handleRemove}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              title="Remove Photo"
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {!value ? (
          /* Upload Area when no image */
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50/50'
                : disabled
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <div>
                <p className="text-gray-600 font-medium mb-1">{placeholder}</p>
                <p className="text-sm text-gray-500">
                  Drag and drop your photo here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Max size: {maxSize}MB • Formats: {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                </p>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isLoading}
                  className={`inline-flex items-center px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors font-medium disabled:opacity-50`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </button>

                {acceptCamera && (
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={disabled || isLoading}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50`}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </button>
                )}
              </div>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(',')}
              onChange={handleInputChange}
              className="hidden"
              disabled={disabled}
            />
            
            {acceptCamera && (
              <input
                ref={cameraInputRef}
                type="file"
                accept={allowedTypes.join(',')}
                capture="environment"
                onChange={handleInputChange}
                className="hidden"
                disabled={disabled}
              />
            )}
          </div>
        ) : (
          /* Enhanced Image Preview Area */
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            {/* Large Preview Section */}
            <div className="mb-4">
              <div className="flex justify-center">
                <div 
                  className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setShowModal(true)}
                  style={{ 
                    width: Math.max(previewSize * 2, 256), 
                    height: Math.max(previewSize * 2, 256) 
                  }}
                >
                  <img
                    src={value}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-lg">
                      <Eye className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                  
                  {/* Success badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Click to view text */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium text-center">Click to view full size</p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Information Section */}
            <div className="space-y-4">
              {/* Success Message */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-semibold text-sm">Photo uploaded successfully</span>
              </div>

              {/* Filename Display */}
              {showFilename && filename && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filename</span>
                      <p className="text-sm font-medium text-gray-900 break-all mt-1" title={filename}>
                        {filename}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* File Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-600 font-medium block text-xs mb-1">File Size</span>
                  <span className="text-blue-800 font-bold text-sm">{getFileSizeDisplay()}</span>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-purple-600 font-medium block text-xs mb-1">Max Resolution</span>
                  <span className="text-purple-800 font-bold text-sm">{outputSize}px</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Replace Photo
                </button>
                
                {showPreview && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Size
                  </button>
                )}
              </div>
            </div>

            {/* Hidden File Inputs for Replace functionality */}
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(',')}
              onChange={handleInputChange}
              className="hidden"
              disabled={disabled}
            />
            
            {acceptCamera && (
              <input
                ref={cameraInputRef}
                type="file"
                accept={allowedTypes.join(',')}
                capture="environment"
                onChange={handleInputChange}
                className="hidden"
                disabled={disabled}
              />
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-800 font-semibold text-sm mb-1">Upload Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Preview Modal */}
      {showModal && value && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-5xl max-h-[95vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Photo Preview</h3>
                  {showFilename && filename && (
                    <p className="text-sm text-gray-600 mt-1">{filename}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="bg-white rounded-2xl p-6 shadow-inner border border-gray-100">
                <img
                  src={value}
                  alt="Full size preview"
                  className="max-w-full max-h-[75vh] object-contain mx-auto rounded-xl shadow-lg"
                />
              </div>
              
              {/* File Info in Modal */}
              <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <Upload className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Size:</span>
                  <span className="font-semibold text-gray-900">{getFileSizeDisplay()}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <Camera className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Max Resolution:</span>
                  <span className="font-semibold text-gray-900">{outputSize}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}