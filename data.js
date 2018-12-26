const elasticsearch = require('elasticsearch');
const cities = require('./cities.json')


const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200/']
});

client.ping({
  requestTimeout: 30000,

}, (error) => {
  if(error){
    console.log(error)
  } else {
    console.log('Everything is ok!')
  }
});

client.indices.create({
  index: 'scotch.io-tutorial'
}, (error, response, status) => {
  if(error){
    console.log(error)
  } else {
    console.log(`Created a new index ${response}`)
  }
});

// Elastic search bulk import
const bulk = [];

cities.forEach(city => {
  bulk.push({ 
    index: {
      _index: "scotch.io-tutorial",
      _type: "cities_list"
    }
  })
  bulk.push(city)
});

client.bulk({body: bulk}, (err, response) => {
  if(err){
    console.log("Failed Bulk Operation: " .red, err)
  } else {
    console.log("Successfully imported %s" .green, cities.length)
  }
})

