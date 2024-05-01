const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();
const redisClient = redis.createClient({
  // when using Docker, use the SERVICE name from docker-compose file
  host: 'redis-server',
  port: 6379 // default redis port
});
redisClient.set('visits', 0);

app.get('/', (req, res) => {
  // process.exit(0); // terminate with exit status 0
  // process.exit(1); // terminate with exit status as error
  redisClient.get('visits', (err, visits) => {
    res.send('Number of visits is ' + visits);
    redisClient.set('visits', parseInt(visits) + 1);
  });
});

app.listen(8081, () => {
  console.log('Listening on Docker container port 8081');
});
