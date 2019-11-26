import { IDriver } from "../../interfaces";

export class MemDriver<K, V> implements IDriver<K, V> {

    private map = new Map();

    constructor() { }

    async open() { }

    async close() { }

    async has(key: K) {
        return this.map.has(key);
    }

    async set(key: K, value: V) {
        this.map.set(key, value);
    }

    async get(key: K) {
        return this.map.get(key);
    }

    async delete(key: K) {
        return this.map.delete(key);
    }

}