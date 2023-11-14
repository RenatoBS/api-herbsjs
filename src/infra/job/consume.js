const amqp = require('amqplib');
const { createFile } = require('./fileWriter');

async function consumeMessages() {
    const rabbitmqConfig = {
        url: 'amqp://localhost',
        queueName: 'operation-queue',
    };
    const connection = await amqp.connect(rabbitmqConfig.url);
    const channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqConfig.queueName, { durable: false });

    console.info('Waiting new messages');

    channel.consume(rabbitmqConfig.queueName, async (message) => {
        const data = JSON.parse(message.content.toString());
        console.info('Processing message:', data);
        createFile(data)

        channel.ack(message);
    });
}

module.exports = { consumeMessages }