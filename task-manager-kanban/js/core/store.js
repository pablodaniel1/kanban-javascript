
export class Store {
  #state;
  #listeners = new Set();

  constructor(initialState = {}) {
    this.#state = structuredClone(initialState);
  }

  getState() {
    return structuredClone(this.#state);
  }

  setState(updater) {
    const nextState = typeof updater === "function"
      ? updater(this.getState())
      : updater;

    this.#state = structuredClone(nextState);
    this.#listeners.forEach((listener) => listener(this.getState()));
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
}
