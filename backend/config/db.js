const mongoose = require('mongoose');
const net = require('net');
const { spawn } = require('child_process');
const fs = require('fs');

/**
 * Check if a TCP port is open locally
 */
const isPortOpen = (port, host = '127.0.0.1') => {
  return new Promise((resolve) => {
    const socket = net.connect(port, host, () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
  });
};

/**
 * Ensure local mongod is running if using local MongoDB
 */
const ensureLocalMongo = async (port = 27018) => {
  const isOpen = await isPortOpen(port);
  if (isOpen) return;

  const dataDir = '/tmp/mongodb_data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`Starting local mongod on port ${port}...`);
  const mongodProc = spawn(
    'mongod',
    ['--port', String(port), '--dbpath', dataDir, '--nounixsocket', '--bind_ip', '127.0.0.1'],
    { stdio: 'ignore', detached: true }
  );
  mongodProc.unref();

  // Wait up to 5 seconds for port to open
  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 200));
    if (await isPortOpen(port)) {
      console.log(`Local mongod is now ready on port ${port}`);
      return;
    }
  }
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/todo_app';

    // If targeting localhost/127.0.0.1, ensure mongod is running
    if (mongoURI.includes('127.0.0.1') || mongoURI.includes('localhost')) {
      const portMatch = mongoURI.match(/:(\d+)/);
      const port = portMatch ? parseInt(portMatch[1], 10) : 27018;
      await ensureLocalMongo(port);
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
