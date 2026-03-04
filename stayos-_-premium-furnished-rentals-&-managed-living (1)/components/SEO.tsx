import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop', // Default fallback image
  canonical,
  type = 'website'
}) => {
  const location = useLocation();
  const siteTitle = 'StayOs | Zero Brokerage Furnished Rentals';
  const fullTitle = title === siteTitle ? title : `${title} | StayOs`;
  const currentUrl = canonical || window.location.href;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    updateMeta('description', description);

    // Open Graph / Facebook
    updateMeta('og:type', type, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:site_name', 'StayOs', 'property');

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:url', currentUrl);
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

  }, [fullTitle, description, image, currentUrl, type, location]);

  return null;
};

export default SEO;
