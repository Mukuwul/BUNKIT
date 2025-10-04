function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizes[size]} ${className}`} />
  );
}

export default LoadingSpinner;
