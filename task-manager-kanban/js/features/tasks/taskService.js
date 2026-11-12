import { createId } from "../../utils/helpers.js";

const VALID_STATUSES = ["todo", "in-progress", "done"];
const VALID_PRIORITIES = ["low", "medium", "high"];

export class TaskService {
  constructor(store, repository) {
    this.store = store;
    this.repository = repository;
  }

  async initialize() {
    const tasks = await this.repository.getAll();
    this.store.setState((state) => ({ ...state, tasks }));
  }

  async create(data) {
    const task = this.#normalize(data);
    const tasks = [...this.store.getState().tasks, task];
    await this.#commit(tasks);
    return task;
  }

  async update(id, changes) {
    const tasks = this.store.getState().tasks.map((task) =>
      task.id === id ? this.#normalize({ ...task, ...changes, id, createdAt: task.createdAt }) : task
    );
    if (!tasks.some((task) => task.id === id)) throw new Error("La tarea no existe.");
    await this.#commit(tasks);
  }

  async remove(id) {
    await this.#commit(this.store.getState().tasks.filter((task) => task.id !== id));
  }

  async move(id, status) {
    if (!VALID_STATUSES.includes(status)) throw new Error("Estado no válido.");
    await this.update(id, { status });
  }

  async #commit(tasks) {
    await this.repository.saveAll(tasks);
    this.store.setState((state) => ({ ...state, tasks }));
  }

  #normalize(data) {
    const title = String(data.title ?? "").trim();
    if (!title) throw new Error("El título es obligatorio.");
    if (title.length > 90) throw new Error("El título no puede superar 90 caracteres.");

    const status = VALID_STATUSES.includes(data.status) ? data.status : "todo";
    const priority = VALID_PRIORITIES.includes(data.priority) ? data.priority : "medium";

    return {
      id: data.id ?? createId(),
      title,
      description: String(data.description ?? "").trim().slice(0, 300),
      status,
      priority,
      createdAt: data.createdAt ?? new Date().toISOString()
    };
  }
}
