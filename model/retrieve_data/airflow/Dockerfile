FROM apache/airflow:2.8.1-python3.10

USER root

# Install Java for Spark
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Make /data writable by airflow
RUN mkdir -p /data && chown -R airflow: /data

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch back to airflow user
USER airflow

# Install Python packages
RUN pip install --no-cache-dir meteostat pyspark "pandas>=2.2.0"

# Ensure PySpark uses python3
ENV PYSPARK_PYTHON=python3
ENV PYSPARK_DRIVER_PYTHON=python3

ENTRYPOINT ["/entrypoint.sh"]