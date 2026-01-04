const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://orange-rook-646425.hostingersite.com';

export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return '/placeholder-product.png'; // Default placeholder
  }
  
  // If already full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If path starts with /, construct full URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Otherwise add /images/ prefix and construct URL
  return `${API_BASE_URL}/images/${imagePath}`;
};
