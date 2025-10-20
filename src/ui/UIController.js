export class UIController {
  constructor(els, pokemonStore, searchStore) {
    this.els = els;
    this.pokemonStore = pokemonStore;
    this.searchStore = searchStore;
  }

  async start() {
    // búsqueda persistida
    const q = this.searchStore.get();
    this.els.searchInput.value = q;

    this.#bindEvents();
    await this.#loadAndRender(q);
  }

  async #loadAndRender(query = '') {
    this.#setLoading(true);
    try {
      await this.pokemonStore.loadAll();
      this.#applyFilter(query);
      this.#renderCount(this.pokemonStore.count(), this.pokemonStore.count());
    } catch (e) {
      console.error(e);
      this.#setEmpty(true);
    } finally {
      this.#setLoading(false);
    }
  }

  #bindEvents() {
    // Búsqueda global
    this.els.searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      this.searchStore.set(q);
      this.#applyFilter(q);
    });
    this.els.searchClear?.addEventListener('click', () => {
      this.els.searchInput.value = '';
      this.searchStore.clear();
      this.#applyFilter('');
      this.els.searchInput.focus();
    });

    // Modal: cerrar
    this.els.modal.addEventListener('click', (ev) => {
      if (ev.target === this.els.modal || ev.target === this.els.modalClose) {
        this.#closeModal();
      }
    });
  }

  #applyFilter(query) {
    const list = this.pokemonStore.search(query);
    this.#renderGrid(list);
    this.#renderCount(list.length, this.pokemonStore.count());
  }

  #renderGrid(list) {
    const $g = this.els.grid;
    $g.innerHTML = '';
    if (!list.length) {
      this.#setEmpty(true);
      return;
    }
    this.#setEmpty(false);

    const frag = document.createDocumentFragment();
    for (const p of list) {
      const card = document.createElement('button');
      card.className =
        'w-full text-left rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md';
      card.innerHTML = `
        <div class="flex items-center gap-3">
          <img loading="lazy" src="${p.img}" alt="${
        p.name
      }" class="h-16 w-16 object-contain"/>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold capitalize">${p.displayName()}</h3>
              <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">#${p.displayId()}</span>
            </div>
            <p class="text-xs text-slate-500">Haz clic para ver más detalles</p>
          </div>
        </div>
      `;
      card.addEventListener('click', () => this.#openDetail(p.name));
      frag.appendChild(card);
    }
    $g.appendChild(frag);
  }

  #renderCount(visible, total) {
    if (!this.els.countBadge) return;
    this.els.countBadge.textContent = `${visible} / ${total} Pokémon`;
  }

  async #openDetail(name) {
    this.#setLoading(true);
    try {
      const p = await this.pokemonStore.getDetail(name);
      const img =
        p.sprites?.other?.['official-artwork']?.front_default ||
        p.sprites?.front_default ||
        '';
      const types = p.types?.map((t) => t.type.name) ?? [];
      const stats = p.stats ?? [];

      const typesHtml = types
        .map(
          (t) =>
            `<span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 capitalize">${t}</span>`
        )
        .join(' ');

      const statsHtml = stats
        .map(
          (s) =>
            `<div class="flex justify-between text-sm">
            <span>${s.stat.name}</span>
            <b class="tabular-nums">${s.base_stat}</b>
          </div>`
        )
        .join('');

      this.#openModal({
        title: `${p.name?.[0]?.toUpperCase() + p.name?.slice(1)}  #${String(
          p.id
        ).padStart(3, '0')}`,
        bodyHTML: `
          <div class="flex gap-4">
            <img src="${img}" alt="${p.name}" class="h-32 w-32 object-contain">
            <div class="flex-1 space-y-2">
              <div class="flex flex-wrap gap-2">${typesHtml}</div>
              <div class="rounded-xl border p-3">
                <h3 class="mb-2 text-sm font-semibold">Estadísticas base</h3>
                ${statsHtml}
              </div>
              <div class="text-xs text-slate-500">Altura: ${p.height} | Peso: ${p.weight}</div>
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error(e);
      this.#openModal({
        title: 'Error',
        bodyHTML: '<p>No se ha podido cargar el detalle.</p>',
      });
    } finally {
      this.#setLoading(false);
    }
  }

  #openModal({ title, bodyHTML }) {
    this.els.modalTitle.textContent = title;
    this.els.modalBody.innerHTML = bodyHTML;
    const $m = this.els.modal;
    $m.classList.remove('invisible');
    requestAnimationFrame(() => $m.classList.add('opacity-100'));
  }

  #closeModal() {
    const $m = this.els.modal;
    $m.classList.remove('opacity-100');
    $m.addEventListener('transitionend', () => $m.classList.add('invisible'), {
      once: true,
    });
  }

  #setLoading(b) {
    this.els.loader.classList.toggle('hidden', !b);
  }
  #setEmpty(b) {
    this.els.empty.classList.toggle('hidden', !b);
  }
}
