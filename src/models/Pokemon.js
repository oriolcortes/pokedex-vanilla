export class Pokemon {
  constructor({ id, name, img }) {
    this.id = Number(id);
    this.name = String(name);
    this.img = String(img);
  }
  displayId() {
    return String(this.id).padStart(3, '0');
  }
  displayName() {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
}
