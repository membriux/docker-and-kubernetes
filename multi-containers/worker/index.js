const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

// Redis best practices: create a separate client that will carry out
// specific tasks. In this case we want a redis client specifically to
// act as a subscriber to redis and listen to messages from redis
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// This is a simple worker node.
// This worker node Subscribes to redis (listen for inserts on redis)
// Example: user inserts a new value to redis (i.e 3), the worker will:
// -> pull value from redis (i.e 3)
// -> calulate the fib of that value (i.e fib(3) -> 2)
// -> insert fib(3) = 2 to redis. 
// -> redis will looks like this after calculating fib(3): {3: 2}
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');

// I know. We are overengineering the heck out of this fib calculator
// But this is to show what a FULL stack app looks like 
// and how to connect all the docker containers together.
