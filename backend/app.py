from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import requests
import time
import threading

app = Flask(__name__)
CORS(app)

DATA_SOURCE_URL = "https://november7-730026606190.europe-west1.run.app/messages/"
CACHE_REFRESH_INTERVAL = 60  # seconds

cache = {
    'data': {'items': [], 'total': 0},
    'last_updated': None
}


def fetch_all_from_source():
    all_items = []
    skip = 0
    limit = 100

    while True:
        r = requests.get(DATA_SOURCE_URL, params={'skip': skip, 'limit': limit})
        if r.status_code != 200:
            break
        data = r.json()
        items = data.get('items', [])
        all_items.extend(items)

        if len(items) < limit:
            break
        skip += limit

    return {'items': all_items, 'total': len(all_items)}


def refresh_cache():
    print("Refreshing cache...")
    data = fetch_all_from_source()
    cache['data'] = data
    cache['last_updated'] = time.time()
    print(f"Cache refreshed with {len(data.get('items', []))} items")


def cache_polling_loop():
    while True:
        time.sleep(CACHE_REFRESH_INTERVAL)
        refresh_cache()


def get_cached_data():
    return cache['data']


def filter_by_user_id(items, user_id):
    filtered_items = list()
    
    for item in items:
        if item['user_id'] == user_id:
            filtered_items.append(item)
    
    return filtered_items


def filter_by_user_name(items, user_name):
    filtered_items = list()
    
    for item in items:
        if item['user_name'] == user_name:
            filtered_items.append(item)
    
    return filtered_items


def filter_by_date_range(items, start_date, end_date):
    filtered_items = list()

    for item in items:
        item_timestamp = datetime.fromisoformat(item['timestamp'].replace('Z', '+00:00'))

        if start_date and item_timestamp < datetime.fromisoformat(start_date):
            continue
        if end_date and item_timestamp > datetime.fromisoformat(end_date):
            continue

        filtered_items.append(item)

    return filtered_items


def search_message(items, query):
    filtered_items = list()
    query_lower = query.lower()

    for item in items:
        if query_lower in item['message'].lower():
            filtered_items.append(item)

    return filtered_items


@app.route('/api/search', methods=['GET'])
def search():
    start_time = time.time()

    q = request.args.get('q', '')
    user_id = request.args.get('user_id', '')
    user_name = request.args.get('user_name', '')
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    data = get_cached_data()
    items = data.get('items', [])

    if q:
        items = search_message(items, q)
    if user_id:
        items = filter_by_user_id(items, user_id)
    if user_name:
        items = filter_by_user_name(items, user_name)
    if start_date or end_date:
        items = filter_by_date_range(items, start_date, end_date)

    total = len(items)
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_items = items[start_idx:end_idx]

    response_time_ms = (time.time() - start_time) * 1000
    print(f"Search response time: {response_time_ms:.2f}ms")

    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'items': paginated_items,
        'response_time_ms': round(response_time_ms, 2)
    })


@app.route('/api/item/<item_id>', methods=['GET'])
def get_item(item_id):
    return jsonify({'error': 'Not implemented'}), 501


@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({'users': []})


def init_cache():
    refresh_cache()
    polling_thread = threading.Thread(target=cache_polling_loop, daemon=True)
    polling_thread.start()


# Initialize cache on module load (works with gunicorn)
init_cache()


if __name__ == '__main__':
    app.run(debug=True, port=5000)
