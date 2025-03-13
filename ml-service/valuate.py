import tensorflow as tf

# Check if TensorFlow is installed correctly
print("TensorFlow Version:", tf.__version__)

# Check if the module is correctly accessible
try:
    from tensorflow.python import pywrap_tensorflow
    print("Module pywrap_tensorflow is available")
except ImportError as e:
    print("Error importing pywrap_tensorflow:", e)
