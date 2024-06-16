class Activity {
  constructor(coords, name, type) {
    this.coords = coords;
    this.name = name;
    this.type = type;
    this.id = (Date.now() + "").slice(-10);
  }
}

class Food extends Activity {
  constructor(coords, name, type, cost) {
    super(coords, name, type);
    this.cost = cost;
    this.description = `Food: ${this.name}`;
  }
}

class Fun extends Activity {
  constructor(coords, name, type, duration) {
    super(coords, name, type);
    this.duration = duration;
    this.description = `Fun: ${this.name}`;
  }
}
