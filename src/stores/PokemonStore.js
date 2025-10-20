import { Pokemon } from '../models/Pokemon.js';

/** Catálogo completo en memoria + búsqueda global por nombre. */
export class PokemonStore {
  constructor({ service }) {
    this.service = service;
    this.all = [];
    this.loaded = false;
  }

  async loadAll() {
    if (this.loaded) return this.all;
    const raw = await this.service.listAll();
    this.all = raw.map((r) => new Pokemon(r));
    this.loaded = true;
    return this.all;
  }

  /** Búsqueda global por nombre (client-side). */
  search(query) {
    const q = String(query ?? '')
      .trim()
      .toLowerCase();
    if (!q) return this.all;
    return this.all.filter((p) => p.name.includes(q));
  }

  count() {
    return this.all.length;
  }

  async getDetail(nameOrId) {
    return this.service.get(nameOrId);
  }
}
