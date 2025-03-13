import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
from tensorflow.keras.optimizers import Adam
import os

# Define dataset paths
train_dir = "dataset/train"
val_dir = "dataset/val"
augmented_dir = "dataset/train_augmented"

# Check if dataset directories exist
if not os.path.exists(train_dir) or not os.path.exists(val_dir):
    raise FileNotFoundError("❌ Dataset directories not found. Check your paths!")

# Create Augmented Directory
if not os.path.exists(augmented_dir):
    os.makedirs(augmented_dir)

# Data Augmentation for Minority Classes (Example: Potato___healthy)
datagen = ImageDataGenerator(
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode="nearest"
)

minority_class = "Potato___healthy"
source_path = os.path.join(train_dir, minority_class)
target_path = os.path.join(augmented_dir, minority_class)

if not os.path.exists(target_path):
    os.makedirs(target_path)

for image in os.listdir(source_path):
    img_path = os.path.join(source_path, image)
    img = load_img(img_path)  # Load image
    img = img_to_array(img)  # Convert to array
    img = img.reshape((1,) + img.shape)  # Reshape for augmentation
    
    i = 0
    for batch in datagen.flow(img, batch_size=1, save_to_dir=target_path, save_format="jpg"):
        i += 1
        if i > 10:  # Create 10 new images per original
            break  # Stop after generating enough images

print("✅ Augmentation complete!")

# Train Data Generator
train_datagen = ImageDataGenerator(rescale=1./255)

# Validation Data Generator (only rescaling)
val_datagen = ImageDataGenerator(rescale=1./255)

# Load dataset
train_generator = train_datagen.flow_from_directory(
    train_dir, 
    target_size=(128, 128), 
    batch_size=32, 
    class_mode="categorical"
)

val_generator = val_datagen.flow_from_directory(
    val_dir, 
    target_size=(128, 128), 
    batch_size=32, 
    class_mode="categorical"
)

print("✅ Data Loaded Successfully!")

# Define Number of Classes
num_classes = 15

# Define Model
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(128, 128, 3)),
    MaxPooling2D(),

    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(),

    Conv2D(128, (3,3), activation='relu'),  # 🔥 Added another Conv2D layer for better learning
    MaxPooling2D(),

    Flatten(),
    Dense(128, activation='relu'),  # Increased neurons
    Dropout(0.4),  # 🔥 Increased dropout to prevent overfitting
    Dense(num_classes, activation='softmax')  
])

# Define EarlyStopping
early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=3,  
    verbose=1,
    restore_best_weights=True  
)

# Model Checkpoint: Saves the best model based on validation accuracy
checkpoint = ModelCheckpoint(
    "crop_disease_best_model.keras", 
    monitor="val_accuracy", 
    save_best_only=True, 
    verbose=1
)

# Compile Model (Fixed: Adjusted learning rate)
optimizer = Adam(learning_rate=0.001)  # 🔥 Slightly increased learning rate
model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])

# Train Model
history = model.fit(
    train_generator, 
    validation_data=val_generator, 
    epochs=10, 
    callbacks=[checkpoint, early_stopping]
)

# Save Final Model
model.save("crop_disease_model.keras")
print("✅ Model training completed and saved!")
