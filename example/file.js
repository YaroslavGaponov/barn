const { tmpdir } = require('os');
const { resolve } = require('path');
const { FileDriver } = require('../dist');

(async () => {
    const driver = new FileDriver(resolve(tmpdir(), 'barn'));
    await driver.open();
    for (let i = 0; i < 3; i++) {
        const key = 'key_' + i;
        const value = 'value_' + i;
        console.log(`key=${key} value=${value}`);
        await driver.set(key, value);
        console.log('has: ', await driver.has(key));
        console.log('get: ', await driver.get(key));
        console.log('deleted: ', await driver.delete(key));
    }
    await driver.close();
})()
