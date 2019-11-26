"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemDriver {
    constructor() {
        this.map = new Map();
    }
    async open() { }
    async close() { }
    async has(key) {
        return this.map.has(key);
    }
    async set(key, value) {
        this.map.set(key, value);
    }
    async get(key) {
        return this.map.get(key);
    }
    async delete(key) {
        return this.map.delete(key);
    }
}
exports.MemDriver = MemDriver;
