import React from 'react';
import './Filters.css';

function Filters({ filters, onChange }) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label>User ID</label>
        <input
          type="text"
          value={filters.userId}
          onChange={(e) => onChange('userId', e.target.value)}
          placeholder="Filter by user ID"
        />
      </div>
      <div className="filter-group">
        <label>User Name</label>
        <input
          type="text"
          value={filters.userName}
          onChange={(e) => onChange('userName', e.target.value)}
          placeholder="Filter by user name"
        />
      </div>
      <div className="filter-group">
        <label>Start Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label>End Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
        />
      </div>
    </div>
  );
}

export default Filters;
