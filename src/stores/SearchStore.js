const KEY = 'pokedex:search';

export class SearchStore {
  get() {
    try {
      return localStorage.getItem(KEY) ?? '';
    } catch {
      return '';
    } // valor seguro si el storage falla
  }
  set(term) {
    try {
      localStorage.setItem(KEY, String(term ?? ''));
    } catch {
      /* no crítico: no romper la UI */
    }
  }
  clear() {
    this.set('');
  }
}
