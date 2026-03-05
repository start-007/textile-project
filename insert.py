import base64
import io
import json

import boto3
from PIL import Image
import base64


def load_image_as_base64(image_path): 
   """Helper function for preparing image data."""
   with open(image_path, "rb") as image_file:
      return base64.b64encode(image_file.read()).decode("utf-8")


inference_params = {
   "taskType": "VIRTUAL_TRY_ON",
   "virtualTryOnParams": {
      "sourceImage": load_image_as_base64("shopping.png"),
      "referenceImage": load_image_as_base64("image.png"),
      "maskType": "GARMENT",
      "garmentBasedMask": {"garmentClass": "UPPER_BODY"}
   }
}



# Create the Bedrock Runtime client.
bedrock = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")

# Prepare the invocation payload.
body_json = json.dumps(inference_params, indent=2)

# Invoke Nova Canvas.
response = bedrock.invoke_model(
   body=body_json,
   modelId="amazon.nova-canvas-v1:0",
   accept="application/json",
   contentType="application/json"
)

# Extract the images from the response.
response_body_json = json.loads(response.get("body").read())
images = response_body_json.get("images", [])

# Check for errors.
if response_body_json.get("error"):
   print(response_body_json.get("error"))

# Decode each image from Base64 and save as a PNG file.
for index, image_base64 in enumerate(images):
   image_bytes = base64.b64decode(image_base64)
   image_buffer = io.BytesIO(image_bytes)
   image = Image.open(image_buffer)
   image.save(f"image_{index}.png")

# import requests
# import random

# API_URL = "http://localhost:5000/api/cloth-item/save-item"

# IMAGE_POOL = [
#     "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
#     "https://images.pexels.com/photos/532588/pexels-photo-532588.jpeg",
#     "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
#     "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
#     "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg"
# ]

# VIDEO_POOL = [
#     "https://www.w3schools.com/html/mov_bbb.mp4"
# ]

# def random_image():
#     return random.choice(IMAGE_POOL)

# def random_video():
#     return random.choice(VIDEO_POOL)

# def generate_product_options():
#     product_options = {}

#     colors = ["Black", "White", "Blue", "Red", "Green"]
#     sizes = ["XS", "S", "M", "L", "XL"]

#     for color in random.sample(colors, random.randint(1, 3)):
#         size_stock = {
#             size: random.randint(1, 50)
#             for size in random.sample(sizes, random.randint(3, 5))
#         }

#         product_options[color] = {
#             "mp_sizes_to_stock": size_stock,
#             "price": random.randint(30, 200),
#             "priceAdjustment": random.randint(-5, 15),
#             "tax": random.choice([5, 10, 12, 18]),
#             "images": [random_image() for _ in range(random.randint(1, 3))],
#             "videos": [random_video()] if random.random() > 0.5 else []
#         }

#     return product_options

# def generate_random_product():
#     return {
#         "title": random.choice(["Classic Tee", "Denim Jacket", "Summer Dress", "Hoodie", "Blazer"]),
#         "title_image": random_image(),
#         "product_type": random.choice(["T-Shirt", "Jacket", "Dress", "Hoodie", "Blazer"]),
#         "mp_des_title_to_description": {
#             "Material": random.choice(["100% Cotton", "Denim", "Polyester", "Wool"]),
#             "Care": random.choice(["Machine Wash", "Hand Wash", "Dry Clean"]),
#             "Fit": random.choice(["Regular", "Slim", "Oversized"])
#         },
#         "gender": random.choice(["men", "women", "unisex"]),
#         "product_options": generate_product_options(),
#         "mp_delivery_type_to_fee": {},
#         "product_reviews_id": None,
#         "product_image": [random_image() for _ in range(random.randint(1, 3))],
#         "product_video": [random_video()] if random.random() > 0.5 else []
#     }

# def post_random_products(count=3):
#     for i in range(count):
#         product = generate_random_product()
#         response = requests.post(API_URL, json=product)

#         if response.status_code == 201:
#             print(f"✅ Inserted {i+1}")
#         else:
#             print(f"❌ Failed {i+1}: {response.text}")

# if __name__ == "__main__":
#     post_random_products()