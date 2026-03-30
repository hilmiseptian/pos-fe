import { useState } from 'react';

export function usePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  function applyMeta(meta) {
    if (!meta) return;
    setCurrentPage(meta.currentPage);
    setLastPage(meta.lastPage);
  }

  return { currentPage, lastPage, setCurrentPage, setLastPage, applyMeta };
}