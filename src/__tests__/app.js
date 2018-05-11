const app = require('./app');

describe('App', () => {
    it('should be imported correctly', () => {
        expect(typeof app).toBe('object');
    });
});