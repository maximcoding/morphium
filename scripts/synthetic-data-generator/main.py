import os
import time
import psutil  # For monitoring memory usage
from concurrent.futures import ThreadPoolExecutor, wait, ALL_COMPLETED  # For multi-threading
from queue import Queue, Empty  # For producer-consumer communication
from anomaly_generator import generate_anomaly_data  # Data generator for anomaly detection
from fraud_generator import generate_fraud_data  # Data generator for fraud detection
from sensitivity_generator import generate_sensitivity_data  # Data generator for sensitivity detection
from parquet_writer import save_to_parquet  # Utility to save data in Parquet format

# Configuration Settings
BATCH_SIZE = 5000  # Number of samples per batch
QUEUE_SIZE = 50  # Maximum number of batches in the queue
NUM_CONSUMER_THREADS = 4  # Number of threads for parallel file writing
FILE_PERMISSIONS = 0o644  # Readable and accessible file permissions
TIMEOUT = 5  # Timeout for queue operations in seconds

# Queue for managing data batches between producer and consumer
data_queue = Queue(maxsize=QUEUE_SIZE)

def log_progress(message):
    """
    Logs progress messages with a timestamp and current memory usage.
    """
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {message} | Memory Usage: {psutil.virtual_memory().percent}%")

def producer(data_generator, dataset_name):
    """
    Producer function that generates data in batches and puts them into the queue.
    Handles backpressure and signals end of data stream.
    """
    log_progress(f"Starting data generation for {dataset_name}...")
    batch = []
    count = 0  # Keeps track of total samples generated

    # Loop through the data generator to produce data in batches
    for item in data_generator:
        batch.append(item)
        if len(batch) >= BATCH_SIZE:
            # Put the batch in the queue with a timeout to avoid blocking
            data_queue.put(batch.copy(), timeout=TIMEOUT)
            count += len(batch)
            log_progress(f"Queued {count} samples for {dataset_name}...")
            batch.clear()

        # Implement backpressure by pausing the producer when the queue is almost full
        while data_queue.qsize() > QUEUE_SIZE * 0.8:
            log_progress(f"Backpressure: Queue is almost full. Pausing producer for {dataset_name}...")
            time.sleep(0.5)

    # Handle the remaining data in the last batch
    if batch:
        data_queue.put(batch.copy(), timeout=TIMEOUT)
        count += len(batch)
        log_progress(f"Queued {count} samples for {dataset_name}...")

    # Wait for the queue to empty before signaling the end of the stream
    while not data_queue.empty():
        log_progress(f"Waiting for queue to empty for {dataset_name}...")
        time.sleep(1)

    # Signal the end of the data stream for each consumer
    for _ in range(NUM_CONSUMER_THREADS):
        data_queue.put(None, timeout=TIMEOUT)

    log_progress(f"Data generation completed for {dataset_name}. Total samples: {count}")

def consumer(filename):
    """
    Consumer function that takes batches from the queue and saves them as Parquet files.
    Uses compression for efficient storage and sets appropriate file permissions.
    """
    log_progress(f"Starting to save {filename}...")
    batch_count = 0  # Counts the number of batches processed

    while True:
        try:
            # Get a batch from the queue with a timeout to avoid blocking
            batch = data_queue.get(timeout=TIMEOUT)
            if batch is None:  # End of the data stream
                break

            batch_count += 1
            # Save batch as a Parquet file with compression to reduce I/O load
            file_path = f"{filename}_batch_{batch_count}.parquet"
            save_to_parquet(batch, file_path, compression='snappy')

            # Set file permissions for readability and accessibility
            os.chmod(file_path, FILE_PERMISSIONS)
            log_progress(f"Saved batch {batch_count} for {filename}. Permissions set to {oct(FILE_PERMISSIONS)}.")

        except Empty:
            # Handle case where no data is available in the queue
            log_progress(f"Timeout: No data to process for {filename}. Retrying...")
            continue

    log_progress(f"Completed saving for {filename}.")

def main():
    """
    Main function to orchestrate the data generation and saving process using ThreadPoolExecutor.
    Utilizes producer-consumer pattern for efficient and parallel data processing.
    """
    log_progress("Starting data generation...")

    # Using ThreadPoolExecutor for concurrent processing
    with ThreadPoolExecutor(max_workers=NUM_CONSUMER_THREADS + 3) as executor:
        # Start producers for generating different datasets
        anomaly_future = executor.submit(producer, generate_anomaly_data(), 'anomaly-data')
        fraud_future = executor.submit(producer, generate_fraud_data(), 'fraud-data')
        sensitivity_future = executor.submit(producer, generate_sensitivity_data(), 'sensitivity-data')

        # Start consumers for saving data in parallel
        consumers = []
        for _ in range(NUM_CONSUMER_THREADS):
            consumers.append(executor.submit(consumer, 'anomaly-data-large'))
            consumers.append(executor.submit(consumer, 'fraud-data-large'))
            consumers.append(executor.submit(consumer, 'sensitivity-data-large'))

        # Wait for all tasks (producers and consumers) to complete
        wait(consumers, timeout=None, return_when=ALL_COMPLETED)

    log_progress("Data generation and saving completed.")

if __name__ == "__main__":
    main()
