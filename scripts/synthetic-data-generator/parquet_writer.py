import os
import pandas as pd  # Import Pandas for DataFrame handling
import pyarrow as pa
import pyarrow.parquet as pq

# Save data to Parquet with compression
def save_to_parquet(batch, filename, compression='snappy'):
    # Check if batch is empty
    if not batch:
        print("[WARNING] Empty batch. No file saved.")
        return

    # Convert list of dictionaries to a Pandas DataFrame
    df = pd.DataFrame(batch)

    # Ensure the directory exists
    output_dir = "src/phone/resources/generated"
    os.makedirs(output_dir, exist_ok=True)

    # Construct the full file path
    file_path = os.path.join(output_dir, filename)

    # Convert the DataFrame to a PyArrow Table
    table = pa.Table.from_pandas(df)

    # Save the Table as a Parquet file
    pq.write_table(table, file_path, compression=compression)

    # Log file size and save success
    file_size = os.path.getsize(file_path)
    print(f"[INFO] {file_path} saved with compression='{compression}' | File Size: {file_size} bytes")
