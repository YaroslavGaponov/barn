export interface IDriver<K, V> {

    open(): Promise<void>;
    close(): Promise<void>;

    has(key: K): Promise<boolean>;
    set(key: K, value: V): Promise<void>;
    get(key: K): Promise<V>;
    delete(key: K): Promise<boolean>;
}