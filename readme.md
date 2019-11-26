Barn
============================
simple key-value storage

## General

The main goal is to make a lightweight storage library as a stub in various prototypes


## How to use it

### Driver interface


```typescript
export interface IDriver<K, V> {

    open(): Promise<void>;
    close(): Promise<void>;

    has(key: K): Promise<boolean>;
    set(key: K, value: V): Promise<void>;
    get(key: K): Promise<V>;
    delete(key: K): Promise<boolean>;
}
```

### Memory storage

```javascript
const { MemDriver } = require('../dist');

(async () => {
    const driver = new MemDriver();

    await driver.open();
    for (let i = 0; i < 3; i++) {

        const key = 'key_' + i;
        const value = 'value_' + i;

        await driver.set(key, value);
        await driver.has(key);
        await driver.get(key);
        await driver.delete(key);

    }
    await driver.close();
})()
```

### File storage

```javascript
const { tmpdir } = require('os');
const { resolve } = require('path');
const { FileDriver } = require('../dist');

(async () => {
    const driver = new FileDriver(resolve(tmpdir(), 'barn'));

    await driver.open();
    for (let i = 0; i < 3; i++) {

        const key = 'key_' + i;
        const value = 'value_' + i;

        await driver.set(key, value);
        await driver.has(key);
        await driver.get(key);
        await driver.delete(key);

    }
    await driver.close();
})()
```

