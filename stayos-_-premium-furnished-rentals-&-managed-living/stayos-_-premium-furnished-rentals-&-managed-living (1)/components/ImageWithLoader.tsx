import React, { useState } from 'react';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, className, containerClassName, loading = "lazy", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate a low-res placeholder for Unsplash images
  const placeholderSrc = src?.includes('unsplash.com') 
    ? `${src.split('?')[0]}?auto=format&fit=crop&w=50&q=10`
    : src;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-ink/5 ${containerClassName || ''}`}>
      {/* Low-res placeholder for perceived performance */}
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-50`}
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`relative z-10 transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithLoader;