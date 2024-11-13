import { Kafka } from 'kafkajs';

export class TestListener {
  private readonly kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
        clientId: 'organization-service',
        brokers: 'kafka:9092',
        sasl: {
          username: 'kafka_user',
          password: 'kafka_password',
          mechanism: "PLAIN" as 'plain',
        },
        ssl: false,
      });
  }

  async listen(): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'test-consumer-group' });

    try {
      await consumer.connect();
      
      // Subscribe to the Debezium topic for table-name table
      // Format: {database.server.name}.public.table-name
      await consumer.subscribe({ 
        topic: 'postgres-topic.public.table-name',
        fromBeginning: true 
      });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            if (!message.value) return;

            const messageValue = JSON.parse(message.value.toString());
            
            console.log(`Received message from topic: ${topic}`);
            console.log('Message payload:', messageValue);

            // Handle different Debezium operations
            switch (messageValue.op) {
              case 'c': // Create
                console.log('Insert operation detected:', messageValue.after);
                break;
              case 'u': // Update
                console.log('Update operation detected:', {
                  before: messageValue.before,
                  after: messageValue.after,
                });
                break;
              case 'd': // Delete
                console.log('Delete operation detected:', messageValue.before);
                break;
              default:
                console.warn('Unknown operation:', messageValue.op);
            }
          } catch (error) {
            console.error('Error processing message:', error);
          }
        },
      });
    } catch (error) {
      console.error('Error in consumer setup:', error);
      throw error;
    }
  }

  async onApplicationShutdown() {
    try {
      const consumer = this.kafka.consumer({ groupId: 'test-consumer-group' });
      await consumer.disconnect();
      console.log('Kafka consumer disconnected');
    } catch (error) {
      console.error('Error disconnecting consumer:', error);
    }
  }
}

export const startTestListener = async () => {
    const listener = new TestListener();
    await listener.listen();
};