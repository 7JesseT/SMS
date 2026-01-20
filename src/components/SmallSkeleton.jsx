import React from 'react';

/**
 * SmallSkeleton - Lightweight loading skeleton for Suspense fallbacks
 * Shows an animated pulse placeholder while components load
 */
export default function SmallSkeleton({ height = '120px', className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-beige-100 to-beige-50 rounded-md ${className}`}
      style={{ height }}
      aria-busy="true"
      aria-label="Loading content..."
    />
  );
}
