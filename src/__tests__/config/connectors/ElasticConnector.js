const elastic = require('../../../config/connectors/ElasticConnector');

describe('ElasticConnector', () => {
    it('should be imported correctly', () => {
        expect(elastic).toBeDefined();
    });
    
});