import algoliasearch from 'algoliasearch';

const client = algoliasearch("T613KS19CJ", "0b3933e1da5be7d3dd03c0c8c567ce98");
const index = client.initIndex("tunga_users");

export default {
    client,
    index
};
