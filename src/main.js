import { elements } from './elements.js';
import { PokemonService } from './services/PokemonService.js';
import { PokemonStore } from './stores/PokemonStore.js';
import { SearchStore } from './stores/SearchStore.js';
import './style.css';
import { UIController } from './ui/UIController.js';

const pokemonService = new PokemonService();
const pokemonStore = new PokemonStore({ service: pokemonService });
const searchStore = new SearchStore();

const ui = new UIController(elements, pokemonStore, searchStore);
ui.start();
