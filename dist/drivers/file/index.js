"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const v8 = require("v8");
const path = require("path");
class FileDriver {
    constructor(folder) {
        this.folder = folder;
    }
    keyToString(key) {
        return v8.serialize(key).toString('hex');
    }
    open() {
        return Promise.resolve()
            .then(_ => new Promise(resolve => fs.exists(this.folder, resolve)))
            .then(exists => new Promise((resolve, reject) => {
            if (exists)
                return resolve();
            fs.mkdir(this.folder, err => err ? reject(err) : resolve());
        }))
            .then(_ => new Promise((resolve, reject) => fs.readdir(this.folder, (err, files) => {
            if (err)
                return reject(err);
            this.keys = new Set(files);
            return resolve();
        })));
    }
    close() {
        return Promise.resolve();
    }
    has(key) {
        const k = this.keyToString(key);
        return Promise.resolve(this.keys.has(k));
    }
    set(key, value) {
        const k = this.keyToString(key);
        const name = path.resolve(this.folder, k);
        return new Promise((resolve, reject) => fs.writeFile(name, v8.serialize({ key, value }), err => {
            if (err)
                return reject(err);
            this.keys.add(k);
            return resolve();
        }));
    }
    get(key) {
        const k = this.keyToString(key);
        const name = path.resolve(this.folder, k);
        return new Promise((resolve, reject) => fs.readFile(name, (err, data) => {
            if (err)
                return reject(err);
            const kv = v8.deserialize(data);
            return resolve(kv.value);
        }));
    }
    delete(key) {
        const k = this.keyToString(key);
        const name = path.resolve(this.folder, k);
        return new Promise((resolve, reject) => fs.unlink(name, err => {
            if (err)
                return reject(err);
            return resolve(true);
        }));
    }
}
exports.FileDriver = FileDriver;
