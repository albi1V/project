# import os
# import shutil
# import random

# # Define paths
# dataset_path = "dataset/PlantVillage"
# train_dir = "dataset/train"
# val_dir = "dataset/val"
# test_dir = "dataset/test"

# # Create train, val, test directories
# for folder in [train_dir, val_dir, test_dir]:
#     os.makedirs(folder, exist_ok=True)

# # Split ratio
# train_ratio = 0.7
# val_ratio = 0.2
# test_ratio = 0.1

# # Process each class folder
# for class_name in os.listdir(dataset_path):
#     class_path = os.path.join(dataset_path, class_name)

#     if os.path.isdir(class_path):  
#         images = os.listdir(class_path)
#         random.shuffle(images)

#         train_split = int(train_ratio * len(images))
#         val_split = int(val_ratio * len(images))

#         train_images = images[:train_split]
#         val_images = images[train_split:train_split + val_split]
#         test_images = images[train_split + val_split:]

#         for image_set, folder in [(train_images, train_dir), (val_images, val_dir), (test_images, test_dir)]:
#             class_folder = os.path.join(folder, class_name)
#             os.makedirs(class_folder, exist_ok=True)

#             for img in image_set:
#                 src_path = os.path.join(class_path, img)
#                 dest_path = os.path.join(class_folder, img)
#                 shutil.move(src_path, dest_path)

# print("✅ Dataset successfully split into train, val, and test!")
