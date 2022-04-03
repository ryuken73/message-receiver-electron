const process = require('process');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
  origins: ['*'],
});

const server = restify.createServer();
server.pre(cors.preflight)
server.use(cors.actual)
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(restify.plugins.pre.context());

server.get('/info', (req, res) => {
  console.log('received req');
  res.send(200, 'ok');
})

server.listen(7000, () => console.log(`listening ${server.name}: ${server.url}`))
