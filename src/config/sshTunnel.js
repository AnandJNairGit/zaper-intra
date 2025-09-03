// src/config/sshTunnel.js
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class SSHTunnel {
  constructor(config) {
    this.config = config;
    this.client = new Client();
    this.server = null;
    this.localPort = null;
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const { ssh, database } = this.config;
      
      // Read the private key file
      let privateKey;
      try {
        const keyPath = path.resolve(ssh.privateKeyPath);
        privateKey = fs.readFileSync(keyPath);
      } catch (error) {
        logger.error('Failed to read SSH private key:', error);
        return reject(error);
      }

      this.client.on('ready', () => {
        logger.info('SSH Client :: ready');
        
        // Create the tunnel
        this.client.forwardOut(
          '127.0.0.1', // Local bind address
          0, // Local bind port (0 = any available port)
          database.host, // Remote host
          database.port, // Remote port
          (err, stream) => {
            if (err) {
              logger.error('SSH Tunnel error:', err);
              return reject(err);
            }

            const net = require('net');
            const server = net.createServer((connection) => {
              connection.pipe(stream).pipe(connection);
            });

            server.listen(0, '127.0.0.1', () => {
              this.localPort = server.address().port;
              this.server = server;
              this.isConnected = true;
              
              logger.info(`SSH Tunnel established on local port ${this.localPort}`);
              resolve(this.localPort);
            });

            server.on('error', (error) => {
              logger.error('Tunnel server error:', error);
              reject(error);
            });
          }
        );
      });

      this.client.on('error', (error) => {
        logger.error('SSH Client error:', error);
        reject(error);
      });

      // Connect to SSH server
      this.client.connect({
        host: ssh.host,
        port: ssh.port,
        username: ssh.username,
        privateKey: privateKey,
        readyTimeout: 30000
      });
    });
  }

  disconnect() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    
    if (this.client) {
      this.client.end();
    }
    
    this.isConnected = false;
    this.localPort = null;
    logger.info('SSH Tunnel disconnected');
  }

  getLocalPort() {
    return this.localPort;
  }

  isActive() {
    return this.isConnected;
  }
}

module.exports = SSHTunnel;
