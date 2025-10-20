const BASE = 'https://pokeapi.co/api/v2';

export class PokemonService {
  /** Trae TODOS los Pokémon (nombre + id + sprite) */
  async listAll() {
    const url = `${BASE}/pokemon?limit=20000&offset=0`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se ha podido cargar la lista');
    const data = await res.json();
    return data.results.map((p) => {
      const id = p.url.split('/').filter(Boolean).pop();
      const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      return { id, name: p.name, img };
    });
  }

  /** Detalle para el modal */
  async get(nameOrId) {
    const res = await fetch(`${BASE}/pokemon/${nameOrId}`);
    if (!res.ok) throw new Error('Pokémon no encontrado');
    return res.json();
  }
}
