export class TaskController {
  constructor({ service, store, view }) {
    this.service = service;
    this.store = store;
    this.view = view;
  }

  async initialize() {
    await this.service.initialize();
    this.store.subscribe((state) => this.view.render(state));
    this.render();
  }

  render() {
    this.view.render(this.store.getState());
  }

  openCreate(status = "todo") {
    this.view.openDialog(null, status);
  }

  openEdit(id) {
    const task = this.store.getState().tasks.find((item) => item.id === id);
    if (task) this.view.openDialog(task);
  }

  async submitForm(data) {
    try {
      if (data.id) await this.service.update(data.id, data);
      else await this.service.create(data);
      this.view.closeDialog();
      this.view.showToast(data.id ? "Tarea actualizada" : "Tarea creada");
    } catch (error) {
      this.view.showToast(error.message || "No se pudo guardar la tarea");
    }
  }

  async deleteTask(id) {
    const task = this.store.getState().tasks.find((item) => item.id === id);
    if (!task || !window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return;
    try {
      await this.service.remove(id);
      this.view.showToast("Tarea eliminada");
    } catch (error) {
      this.view.showToast(error.message);
    }
  }

  async moveTask(id, status) {
    const task = this.store.getState().tasks.find((item) => item.id === id);
    if (!task || task.status === status) return;
    try {
      await this.service.move(id, status);
      this.view.showToast(`Movida a: ${status === "todo" ? "Por hacer" : status === "done" ? "Completadas" : "En progreso"}`);
    } catch (error) {
      this.view.showToast(error.message);
    }
  }
}
