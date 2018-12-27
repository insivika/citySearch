const express = require('express');
const bodyparser = require('body-parser');
const path = require('path')
const elasticsearch = require('elasticsearch');

// instaiate and elasticsearch client
const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200/']
});

const app = express();

// Ping client to ensure elastic search is up
client.ping({
  requestTimeout: 30000,
}, (error) => {
  if(error) {
    console.error('Elasticsearch cluster is down!')
  } else {
    console.log('Everthing is ok!')
  }
});

// Instatiate middleware
app.use(bodyparser.json());

app.set('port', process.env.PORT || 3001);

app.use(express.static(path.join(__dirname, '/public')));
// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile('template.html', {
    root: path.join(__dirname, 'views')
  });
});

app.get('/search', (req, res) => {

  let body ={
    size: 200,
    from: 0,
    query: {
      match: {
        name: req.query['q']
      }
    }
  }
  client.search({index: 'scotch.io-tutorial', body: body, type: 'cities_list' })
    .then(results => {
      res.send(results.hits.hits)
    })
    .catch(err => {
      console.log(err),
      res.send([]);
    });
});

app.get('/v2', (req, res) => {
  res.sendFile('template2.html', {
    root: path.join( __dirname, 'views')
  })
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
})
