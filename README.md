# Debezium Chart | Connecting to a SASL-Enabled Kafka Cluster

## Overview

This chart deploys Debezium, a distributed platform for change data capture (CDC). It allows you to stream changes from databases into Kafka topics, enabling real-time data integration.

## Prerequisites

Before deploying the Debezium chart, ensure you have the following prerequisites:

- **PostgreSQL**: 
  - Ensure that PostgreSQL is configured with Write-Ahead Logging (WAL) and logical replication enabled.
  - Additionally, set `wal_level` to `logical` and `max_wal_senders` to a suitable value to support replication.
  
- **Kafka**: 
  - A Kafka cluster must be running to receive the change events from Debezium.

## SASL Authentication

If your Kafka setup requires SASL authentication, you need to provide the following environment variables in the Debezium configuration:

- `CONNECT_SASL_MECHANISM`: The SASL mechanism to use (e.g., "PLAIN").
- `CONNECT_SECURITY_PROTOCOL`: The security protocol to use (e.g., "SASL_PLAINTEXT").
- `CONNECT_SASL_JAAS_CONFIG`: The JAAS configuration for SASL authentication, which includes the username and password for 
Kafka.
- `CONNECT_PRODUCER_SASL_MECHANISM`: The SASL mechanism for the producer (e.g., "PLAIN").
- `CONNECT_PRODUCER_SECURITY_PROTOCOL`: The security protocol for the producer (e.g., "SASL_PLAINTEXT").
- `CONNECT_PRODUCER_SASL_JAAS_CONFIG`: The JAAS configuration for SASL authentication for the producer.
- `CONNECT_CONSUMER_SASL_MECHANISM`: The SASL mechanism for the consumer (e.g., "PLAIN").
- `CONNECT_CONSUMER_SECURITY_PROTOCOL`: The security protocol for the consumer (e.g., "SASL_PLAINTEXT").
- `CONNECT_CONSUMER_SASL_JAAS_CONFIG`: The JAAS configuration for SASL authentication for the consumer.


### Note

If your Kafka setup does not require SASL authentication, you can omit the above variables from your configuration.

## Deployment

To deploy the Debezium chart, use the following command:


`helm install debezium ./charts/debezium`


Make sure to replace `./charts/debezium` with the actual path to your Debezium chart.

## Connector Configuration and Job Registration

In this setup, the connector configuration is stored inside the container. You can register the connector by running a Kubernetes Job that initializes the connector using a POST request to the Debezium REST API.

### Automatic Registration via Job

To automatically register the connector, you can use the provided Kubernetes Job configuration. This job will wait for Kafka Connect to be ready and then send a POST request to register the connector using the configuration stored in the container.

### Example Job Configuration

Refer to the `job.yaml` file in the Debezium chart for the job configuration. It includes commands to check the readiness of Kafka Connect and to register the connector.

### Manual Registration

Alternatively, you can manually register a connector by sending a POST request to the Debezium REST API. You can use a tool like `curl` to do this. Here’s an example of how to manually register a connector:

```bash
kubectl exec -it <kafka-connect-pod-name> -- curl -X POST -H "Content-Type: application/json" --data '{
  "name": "connector-name",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "database.hostname": "postgres-host",
    "database.port": "5432",
    "database.user": "postgres-user",
    "database.password": "postgres-password",
    "database.dbname": "postgres-db",
    "database.server.name": "postgres-db-server",
    "table.include.list": "public.table-name",
    "plugin.name": "pgoutput",
    "slot.name": "debezium_table_slot",
    "publication.name": "debezium_table_pub",
    "topic.prefix": "deb-pg-postgres"
  }
}' http://localhost:8083/connectors
```
## Communicating with Kafka

To communicate with Kafka, you need to ensure that your Kafka cluster is running and accessible. You can use the `kafkajs` library to interact with Kafka from your Node.js application.

### SASL Authentication

If your Kafka setup requires SASL (Simple Authentication and Security Layer) authentication, you need to configure the following parameters in your Kafka client:

- **`username`**: The username for authenticating with the Kafka broker.
- **`password`**: The password associated with the username.
- **`mechanism`**: The SASL mechanism to use, such as "PLAIN" or "SCRAM-SHA-256".

Here’s an example of how to configure SASL in your Kafka client:

```typescript
const kafka = new Kafka({
  clientId: 'client-service',
  brokers: ['kafka:9092'],
  sasl: {
    username: 'kafka_user', // Replace with your Kafka username
    password: 'kafka_password', // Replace with your Kafka password
    mechanism: 'PLAIN' as 'plain', // Use the appropriate mechanism
  },
  ssl: false, // Set to true if using SSL
});
```

### Listening to a Topic

To listen to a specific topic in Kafka, you can use a consumer that subscribes to the desired topic. The consumer will receive messages published to that topic and can process them accordingly.

Make sure to follow the naming convention for your topics, which typically follows the format `{database.server.name}.public.table-name` for Debezium topics.

For more detailed implementation instructions, refer to the documentation of the `kafkajs` library or the specific consumer implementation in your application.

## Conclusion

This README provides a basic overview of the Debezium chart and its prerequisites. For more detailed configuration options, please refer to the official Debezium documentation.


