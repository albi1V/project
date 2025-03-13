from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
import os
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Load your trained model
MODEL_PATH = "model/crop_disease_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Define allowed image extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Function to check file extension
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# API Endpoint: Upload image & get prediction
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format"}), 400

    # Secure filename and save temporarily
    filename = secure_filename(file.filename)
    filepath = os.path.join("uploads", filename)
    file.save(filepath)

    # Load and preprocess image
    image = Image.open(filepath).resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    # Make prediction
    prediction = model.predict(image)
    predicted_class = np.argmax(prediction)  # Get class index
    confidence = float(np.max(prediction))  # Get confidence score

    # Cleanup (delete temp file)
    os.remove(filepath)

    # Define crop disease categories (replace with your actual labels)
    disease_classes = ["Healthy", "Bacterial Blight", "Leaf Rust", "Powdery Mildew"]

    return jsonify({
        "disease": disease_classes[predicted_class],
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(debug=True)
