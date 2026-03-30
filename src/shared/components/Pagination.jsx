export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null; // No pagination needed

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center my-8">
      <div className="join">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`join-item btn ${
              page === currentPage ? 'btn-active' : ''
            }`}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
