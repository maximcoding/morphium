import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
import os

# Attention Layer with best practices
class AttentionLayer(layers.Layer):
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(name="attention_weight",
                                 shape=(input_shape[-1], input_shape[-1]),
                                 initializer="glorot_uniform",
                                 trainable=True)
        self.b = self.add_weight(name="attention_bias",
                                 shape=(input_shape[-1],),
                                 initializer="zeros",
                                 trainable=True)
        super(AttentionLayer, self).build(input_shape)

    def call(self, inputs):
        u = tf.tanh(tf.tensordot(inputs, self.W, axes=1) + self.b)
        a = tf.nn.softmax(u, axis=1)
        output = tf.reduce_sum(inputs * a, axis=1)
        return output

# Load and preprocess data from Parquet files with dynamic padding and truncation
def load_data_from_parquet(file_path, max_length=None):
    df = pd.read_parquet(file_path)
    print(df.head())  # Debugging: Check Parquet structure

    # Convert phone numbers to list of digits
    X = []
    for phone in df['phoneNumber']:
        digits = list(map(int, list(phone.replace('+', ''))))
        X.append(digits)

    # Determine the maximum length dynamically
    if max_length is None:
        max_length = max(len(x) for x in X)
        print(f"Dynamically calculated max_length: {max_length}")

    # Pad or truncate sequences to match max_length
    X = [
        np.pad(x[-max_length:], (max_length - len(x[-max_length:]), 0), mode='constant')
        for x in X
    ]

    # Convert to NumPy array and normalize
    X = np.array(X, dtype=np.float32)
    X = X / 9  # Normalize digits

    y = np.array(df['label'], dtype=np.float32)
    return X, y

# Create advanced model with Bidirectional LSTM and Attention
def create_model(input_shape):
    inputs = layers.Input(shape=input_shape)
    x = layers.Bidirectional(layers.LSTM(64, return_sequences=True))(inputs)
    x = layers.BatchNormalization()(x)
    x = AttentionLayer()(x)
    x = layers.Dense(64, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)
    model = keras.Model(inputs, outputs)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Train and save model with best practices
def train_and_save_model(X, y, model_name):
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model = create_model((X_train.shape[1], 1))

    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3, min_lr=1e-6),
        keras.callbacks.TensorBoard(log_dir=f"logs/{model_name}")
    ]

    # Train
    model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=30, batch_size=32, callbacks=callbacks)

    # Save model in both TensorFlow SavedModel and HDF5 formats
    save_path = os.path.join(os.path.dirname(__file__), model_name)
    model.save(save_path)  # TensorFlow SavedModel Format
    model.save_weights(os.path.join(save_path, 'weights.h5'))  # HDF5 Format
    print(f"{model_name} saved at {save_path}")

# Main function to load data, train models, and save them
def main():
    # Load training data from Parquet files in the correct directory
    X_sens, y_sens = load_data_from_parquet('./src/phone/resources/generated/sensitivity-data-large_batch_1.parquet')
    X_anom, y_anom = load_data_from_parquet('./src/phone/resources/generated/anomaly-data-large_batch_1.parquet')
    X_fraud, y_fraud = load_data_from_parquet('./src/phone/resources/generated/fraud-data-large_batch_1.parquet')

    # Train and save models
    train_and_save_model(X_sens, y_sens, 'sensitivity-model')
    train_and_save_model(X_anom, y_anom, 'anomaly-detection-model')
    train_and_save_model(X_fraud, y_fraud, 'fraud-detection-model')


if __name__ == "__main__":
    main()
