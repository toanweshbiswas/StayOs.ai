import React, { useState } from 'react';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, className, containerClassName, loading = "lazy", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-black/5 ${containerClassName || ''}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithLoader;