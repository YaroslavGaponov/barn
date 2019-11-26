import * as fs from "fs";
import * as v8 from "v8";
import * as path from "path";

import { IDriver } from "../../interfaces";

export class FileDriver<K, V> implements IDriver<K, V> {

    private keys: Set<string>;

    constructor(private folder: string) {
    }

    private keyToString(key: K): string {
        return v8.serialize(key).toString('hex');
    }

    open(): Promise<void> {
        return Promise.resolve()
            .then(_ => new Promise(
                resolve =>
                    fs.exists(
                        this.folder,
                        resolve
                    )
            ))
            .then(exists => new Promise(
                (resolve, reject) => {
                    if (exists) return resolve();
                    fs.mkdir(this.folder, err => err ? reject(err) : resolve());
                }
            ))
            .then(_ => new Promise(
                (resolve, reject) =>
                    fs.readdir(this.folder, (err, files) => {
                        if (err) return reject(err);
                        this.keys = new Set<string>(files);
                        return resolve();
                    })
            ))
    }

    close(): Promise<void> {
        return Promise.resolve();
    }

    has(key: K): Promise<boolean> {
        const k = this.keyToString(key);
        return Promise.resolve(this.keys.has(k));
    }

    set(key: K, value: V): Promise<void> {
        const k = this.keyToString(key);
        const name = path.resolve(this.folder, k);
        return new Promise(
            (resolve, reject) =>
                fs.writeFile(
                    name,
                    v8.serialize({ key, value }),
                    err => {
                        if (err) return reject(err);
                        this.keys.add(k);
                        return resolve();
                    })
        );
    }

    get(key: K): Promise<V> {
        const k = this.keyToString(key);
        const name = path.resolve(this.folder, k);
        return new Promise(
            (resolve, reject) =>
                fs.readFile(
                    name,
                    (err, data) => {
                        if (err) return reject(err);
                        const kv = v8.deserialize(data);
                        return resolve(kv.value as V);
                    })
        );
    }

    delete(key: K): Promise<boolean> {
        const k = this.keyToString(key);
        const name = path.resolve(this.folder, k);
        return new Promise(
            (resolve, reject) =>
                fs.unlink(
                    name,
                    err => {
                        if (err) return reject(err);
                        return resolve(true);
                    })
        );
    }


}