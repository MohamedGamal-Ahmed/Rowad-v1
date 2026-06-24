import { useState } from 'react';

export function useTenderSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  return {
    searchQuery,
    setSearchQuery,
  };
}
