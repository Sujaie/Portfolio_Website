import React from 'react';

/**
 * Shared layout container enforcing maximum content width,
 * responsive horizontal gutters, and centered alignment across all sections.
 */
export default function Container({ children, className = '' }) {
  return (
    <div className={`relative z-10 max-w-[var(--content-max-width)] w-full mx-auto ${className}`}>
      {children}
    </div>
  );
}
