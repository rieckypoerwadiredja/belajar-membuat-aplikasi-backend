const Hapi = require('@hapi/hapi');

// Routes
const routes = require('./routes');

const Init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjala pada ${server.info.uri}`);
};

Init();
