const info = require('../../../config/connectors/Info');

describe('Info', () => {
    it('should be imported correctly', () => {
        expect(typeof info).toBe('function');
    });
});