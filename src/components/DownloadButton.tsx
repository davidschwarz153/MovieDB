import { Download } from 'lucide-react';
import { useState } from 'react';

interface DownloadButtonProps {
  url: string;
  filename: string;
  label?: string;
  className?: string;
}

export default function DownloadButton({ url, filename, label = 'Download', className = '' }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // Create an image element to handle CORS properly
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Could not create blob'));
        }, 'image/jpeg', 0.95);
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors duration-300 shadow-lg 
        ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-purple-700 hover:shadow-purple-500/50'} 
        ${className}`}
    >
      <Download size={20} className={isLoading ? 'animate-bounce' : ''} />
      <span>{isLoading ? 'Downloading...' : label}</span>
    </button>
  );
} 