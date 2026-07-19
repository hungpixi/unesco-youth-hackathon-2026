import Dexie, { type Table } from 'dexie';

export class EchoShieldDatabase extends Dexie {
  store!: Table<{ key: string; value: string }, string>;

  constructor() {
    super('EchoShieldGameDB');
    this.version(1).stores({
      store: 'key'
    });
  }
}

export const db = new EchoShieldDatabase();
