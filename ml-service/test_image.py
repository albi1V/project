import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing import image
import sys  # To accept image path from Node.js
import os  
import io

# Force stdout to use UTF-8 encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Ensure command-line argument is provided
if len(sys.argv) < 2:
    print("❌ No image path provided!")
    sys.exit(1)

# Get image path from Node.js
test_image_path = sys.argv[1]  # Accepts image path from Node.js

# Validate if the file exists
if not os.path.exists(test_image_path):
    print(f"❌ Error: Image file not found at {test_image_path}")
    sys.exit(1)

# Load the trained model (use absolute path if needed)
model_path = "V:/test/project - (loc)/ml-service/crop_disease_best_model.keras"
if not os.path.exists(model_path):
    print(f"❌ Error: Model file not found at {model_path}")
    sys.exit(1)

model = keras.models.load_model(model_path)
print("Model Loaded Successfully!")  # Removed Unicode to avoid issues

# Function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(128, 128))  # Resize image
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Normalize
    return img_array

# Preprocess the uploaded image
img_array = preprocess_image(test_image_path)

# Make prediction
predictions = model.predict(img_array)

# Get predicted class index
predicted_class_index = np.argmax(predictions, axis=1)[0]

# Define class labels from dataset folders
train_dir = "V:/test/project - (loc)/ml-service/dataset/train"
if not os.path.exists(train_dir):
    print("❌ Error: Training dataset directory not found!")
    sys.exit(1)

class_labels = sorted(os.listdir(train_dir))  # Get class names from folder names
predicted_class_name = class_labels[predicted_class_index]

# Print prediction result
print(f"Predicted Class: {predicted_class_name}")  # Removed Unicode to avoid issues

# Send only the prediction result back to Node.js
print(predicted_class_name)
