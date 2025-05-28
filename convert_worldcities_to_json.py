import csv
import json

INPUT_CSV = 'DB 1/worldcities.csv'
OUTPUT_JSON = 'public/worldcities.min.json'
TOP_N = 10000

cities = []

with open(INPUT_CSV, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            population = int(float(row['population'])) if row['population'] else 0
        except Exception:
            population = 0
        cities.append({
            'city': row['city_ascii'],
            'country': row['country'],
            'admin_name': row['admin_name'],
            'lat': float(row['lat']),
            'lng': float(row['lng']),
            'population': population
        })

# Sort by population descending and take top N
cities = sorted(cities, key=lambda x: x['population'], reverse=True)[:TOP_N]

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(cities, f, ensure_ascii=False, indent=2)

print(f"Exported {len(cities)} cities to {OUTPUT_JSON}") 