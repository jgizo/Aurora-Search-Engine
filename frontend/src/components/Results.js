import React from 'react';
import './Results.css';

function Results({ results, total, page, loading, onPageChange }) {
  const perPage = 20;
  const totalPages = Math.ceil(total / perPage);

  if (loading) {
    return <div className="results-loading">Loading...</div>;
  }

  return (
    <div className="results">
      <div className="results-header">
        <span>{total} results found</span>
      </div>
      <div className="results-list">
        {results.map((item) => (
          <div key={item.id} className="result-item">
            <div className="result-meta">
              <span className="result-user">{item.user_name}</span>
              <span className="result-date">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="result-message">{item.message}</p>
            <div className="result-ids">
              <span>ID: {item.id}</span>
              <span>User ID: {item.user_id}</span>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Results;
