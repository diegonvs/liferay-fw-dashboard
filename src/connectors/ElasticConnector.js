import {Client} from 'elasticsearch';

const client = Client({
    host: 'localhost:9200', 
    log: 'trace'
});

export default client;