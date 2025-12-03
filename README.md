# Search Engine

**Live Demo:** https://aurora-search-api.onrender.com

## Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Runs on http://localhost:5000

## Frontend

```bash
cd frontend
npm install
npm start
```

Runs on http://localhost:3000

## API

### GET /api/search

| Parameter | Description |
|-----------|-------------|
| q | Search query (searches message text) |
| user_id | Filter by user ID |
| user_name | Filter by user name |
| start_date | Filter by start date (ISO format) |
| end_date | Filter by end date (ISO format) |
| page | Page number (default: 1) |
| per_page | Results per page (default: 20) |

## Bonus Goals
### Bonus 1: Design Notes
I approached the current search engine with in-memory caching with background polling. Data is fetched from the source API upon app startup, and it is stored in memory. This is then refreshed every 60 seconds incase of any updates. The polling interval can be adjusted as needed. Search queries filter the cached data, so we can avoid any additional network calls during requests.

An alternative approach that could be considered here is using a database to store the returned data. This would work better for larger data sets, and ensure consistency across users had this been scaled out large enough. The tradeoff however is there is added infrastructure and complexity. 

Another alternative is if we opt to use Redis for caching, rather than in-memory storage. That enables scalability for our search engine, as multiple servers could share a cache. This also survives system restarts. However, there's an additional dependency in this case, and an additional network hop to Redis.

### Bonus 2: Data Insights
The backend processing time is already under 1ms with in-memory storage. To reduce total response time to 30ms, the focus would need to be on reducing network latency. So we could deploy to edge locations closer to users, or use a CDN for static responses or cache headers for repeated queries 