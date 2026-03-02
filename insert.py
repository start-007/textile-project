import requests
import random
import uuid

API_URL = "http://localhost:5000/api/cloth-item/save-item"

titles = ["Classic Tee", "Denim Jacket", "Summer Dress", "Hoodie", "Blazer"]
product_types = ["T-Shirt", "Jacket", "Dress", "Hoodie", "Blazer"]
genders = ["MALE", "FEMALE", "UNISEX"]
colors = ["Black", "White", "Blue", "Red", "Green"]
sizes = ["XS", "S", "M", "L", "XL"]

delivery_types = ["standard", "express"]

def random_stock():
    return random.randint(1, 50)

def random_price():
    return random.randint(30, 200)

def random_tax():
    return random.choice([5, 10, 12, 18])

def generate_product_options():
    product_options = {}

    for color in random.sample(colors, random.randint(1, 3)):
        size_stock = {size: random_stock() for size in random.sample(sizes, random.randint(3, 5))}

        product_options[color] = {
            "mp_sizes_to_stock": size_stock,
            "price": random_price(),
            "priceAdjustment": random.randint(-5, 15),
            "tax": random_tax(),
            "images": [
                f"https://s3.fake.com/{color.lower()}-{uuid.uuid4()}.jpg"
                for _ in range(random.randint(1, 3))
            ],
            "videos": [
                f"https://s3.fake.com/{color.lower()}-{uuid.uuid4()}.mp4"
                for _ in range(random.randint(0, 2))
            ]
        }

    return product_options

def generate_delivery_fees():
    delivery_map = {}

    for dtype in delivery_types:
        delivery_map[dtype] = {
            "base_fee": random.randint(30, 80),
            "price_per_km": random.randint(3, 10),
            "min_km": 0,
            "max_km": random.choice([10, 15, 20, None])
        }

    return delivery_map

def generate_random_product():
    return {
        "title": random.choice(titles),
        "title_image": f"https://s3.fake.com/title-{uuid.uuid4()}.jpg",
        "product_type": random.choice(product_types),
        "mp_des_title_to_description": {
            "Material": random.choice(["100% Cotton", "Denim", "Polyester", "Wool"]),
            "Care": random.choice(["Machine Wash", "Hand Wash", "Dry Clean"]),
            "Fit": random.choice(["Regular", "Slim", "Oversized"])
        },
        "gender": random.choice(genders),
        "product_options": generate_product_options(),
        "mp_delivery_type_to_fee": generate_delivery_fees(),
        "product_reviews_id": None,
        "product_image": [
            f"https://s3.fake.com/main-{uuid.uuid4()}.jpg"
            for _ in range(random.randint(1, 3))
        ],
        "product_video": [
            f"https://s3.fake.com/main-{uuid.uuid4()}.mp4"
            for _ in range(random.randint(0, 2))
        ]
    }

def post_random_products(count=3):
    for i in range(count):
        product = generate_random_product()
        response = requests.post(API_URL, json=product)

        if response.status_code == 201:
            print(f"✅ Inserted {i+1}")
        else:
            print(f"❌ Failed {i+1}: {response.text}")

if __name__ == "__main__":
    post_random_products()