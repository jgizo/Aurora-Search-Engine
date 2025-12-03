import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Results from './components/Results';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    userId: '',
    userName: '',
    startDate: '',
    endDate: ''
  });
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);

  const handleSearch = async (newPage = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      q: query,
      user_id: filters.userId,
      user_name: filters.userName,
      start_date: filters.startDate,
      end_date: filters.endDate,
      page: newPage,
      per_page: 20
    });

    try {
      const startTime = performance.now();
      const API_URL = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${API_URL}/api/search?${params}`);
      const data = await response.json();
      const endTime = performance.now();
      setResults(data.items);
      setTotal(data.total);
      setPage(newPage);
      setResponseTime({
        frontend: Math.round(endTime - startTime),
        backend: data.response_time_ms
      });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Search Engine</h1>
      </header>
      <main className="main">
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={() => handleSearch(1)}
        />
        {responseTime && (
          <p style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
            Response time: {responseTime.frontend}ms total (backend: {responseTime.backend}ms)
          </p>
        )}
        <Filters
          filters={filters}
          onChange={handleFilterChange}
        />
        <Results
          results={results}
          total={total}
          page={page}
          loading={loading}
          onPageChange={handleSearch}
        />
      </main>
    </div>
  );
}

export default App;
