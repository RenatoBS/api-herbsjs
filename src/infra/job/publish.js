const amqp = require('amqplib');

async function publishToQueue(message) {
    const rabbitmqConfig = {
        url: 'amqp://localhost',
        queueName: 'operation-queue',
      };
      
    const connection = await amqp.connect(rabbitmqConfig.url);
    const channel = await connection.createChannel();

    await channel.assertQueue(rabbitmqConfig.queueName, { durable: false });
    channel.sendToQueue(rabbitmqConfig.queueName, Buffer.from(JSON.stringify(message)));

    console.info('Published message:', message);

    setTimeout(() => {
        connection.close();
    }, 500); 
}

module.exports = { publishToQueue }