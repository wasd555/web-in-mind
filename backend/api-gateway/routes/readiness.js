const express = require('express');
const probeRouter = express.Router();

const { fetch } = require('undici');
const amqplib = require('amqplib');



let rmqConn = null;
let rmqChan = null;
const rmqUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const directusUrl = process.env.DIRECTUS_URL || 'http://directus:8055';

(async () => {
    try {
        rmqConn = await amqplib.connect(rmqUrl);
        rmqChan = await rmqConn.createChannel();
        console.log('RabbitMQ connected for readiness probe');
    } catch (e) {
        console.error('RMQ init failed:', e);
    }
})();

// Liveness
probeRouter.get('/live', (_req, res) => {
    res.status(200).json({ status: 'live', ts: Date.now() });
});

// Readiness
probeRouter.get('/ready', async (_req, res) => {
    const checks = { directus: false, rabbitmq: false };

    try {
        const r = await fetch(`${directusUrl}/server/health`, { timeout: 2000 });
        checks.directus = r.ok;
    } catch {
        checks.directus = false;
    }

    try {
        checks.rabbitmq = Boolean(rmqConn && rmqChan);
    } catch {
        checks.rabbitmq = false;
    }

    const ok = Object.values(checks).every(Boolean);
    res.status(ok ? 200 : 503).json({ status: ok ? 'ready' : 'not-ready', checks, ts: Date.now() });
});

module.exports = probeRouter;