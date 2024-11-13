# Debezium Chart README

## Overview

This chart deploys Debezium, a distributed platform for change data capture (CDC). It allows you to stream changes from databases into Kafka topics, enabling real-time data integration.

## Prerequisites

Before deploying the Debezium chart, ensure you have the following prerequisites:

- **PostgreSQL**: 
  - Ensure that PostgreSQL is configured with Write-Ahead Logging (WAL) and logical replication enabled.
  
- **Kafka**: 
  - A Kafka cluster must be running to receive the change events from Debezium.

## SASL Authentication

If your Kafka setup requires SASL authentication, you need to provide the following environment variables in the Debezium configuration:

- `CONNECT_SASL_MECHANISM`: The SASL mechanism to use (e.g., "PLAIN").
- `CONNECT_SECURITY_PROTOCOL`: The security protocol to use (e.g., "SASL_PLAINTEXT").
- `CONNECT_SASL_JAAS_CONFIG`: The JAAS configuration for SASL authentication, which includes the username and password for Kafka.


### Note

If your Kafka setup does not require SASL authentication, you can omit the above variables from your configuration.

## Deployment

To deploy the Debezium chart, use the following command:


helm install debezium ./charts/debezium


Make sure to replace `./charts/debezium` with the actual path to your Debezium chart.

## Conclusion

This README provides a basic overview of the Debezium chart and its prerequisites. For more detailed configuration options, please refer to the official Debezium documentation.
