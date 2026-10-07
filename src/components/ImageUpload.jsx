import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

const ImageUpload = ({ bucketName = import.meta.env.VITE_SUPABASE_BUCKET_ID || 'hasani_clothing_products_images', onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async (event) => {
    try {
      setUploading(true);
      setError(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Generate a unique file name to prevent overriding
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded image
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const uploadedUrl = data.publicUrl;
      setImageUrl(uploadedUrl);
      
      // Pass the URL up to the parent component (like a product form)
      if (onUploadComplete) {
        onUploadComplete(uploadedUrl);
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 
            ${error ? 'border-red-400' : 'border-gray-300 hover:bg-gray-100'} 
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            ) : imageUrl ? (
              <CheckCircle className="w-8 h-8 mb-3 text-green-500" />
            ) : (
              <UploadCloud className="w-8 h-8 mb-3 text-gray-500" />
            )}
            
            <p className="mb-2 text-sm text-gray-500 font-semibold">
              {uploading ? 'Uploading...' : imageUrl ? 'Upload Successful' : 'Click to upload'}
            </p>
            {!imageUrl && !uploading && (
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img
            src={imageUrl}
            alt="Uploaded Preview"
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
