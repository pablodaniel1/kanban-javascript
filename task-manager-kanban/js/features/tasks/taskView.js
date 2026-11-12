import { escapeHTML, formatDate } from "../../utils/helpers.js";

const STATUS_LABELS = { todo: "Por hacer", "in-progress": "En progreso", done: "Completada" };
const PRIORITY_LABELS = { low: "Baja", medium: "Media", high: "Alta" };

export class TaskView {
  constructor() {
    this.board = document.querySelector("#board");
    this.searchInput = document.querySelector("#search-input");
    this.priorityFilter = document.querySelector("#priority-filter");
    this.counter = document.querySelector("#task-counter");
    this.dialog = document.querySelector("#task-dialog");
    this.form = document.querySelector("#task-form");
    this.toastElement = document.querySelector("#toast");
    this.filters = { search: "", priority: "all" };
    this.toastTimer = null;
  }

  bind(controller) {
    this.controller = controller;
    document.querySelector("#add-task-button").addEventListener("click", () => controller.openCreate());
    document.querySelector("#close-dialog").addEventListener("click", () => this.dialog.close());
    document.querySelector("#cancel-dialog").addEventListener("click", () => this.dialog.close());

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      controller.submitForm(this.getFormData());
    });

    this.searchInput.addEventListener("input", () => {
      this.filters.search = this.searchInput.value.trim().toLowerCase();
      controller.render();
    });
    this.priorityFilter.addEventListener("change", () => {
      this.filters.priority = this.priorityFilter.value;
      controller.render();
    });

    this.board.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add-status]");
      const editButton = event.target.closest("[data-edit-id]");
      const deleteButton = event.target.closest("[data-delete-id]");
      if (addButton) controller.openCreate(addButton.dataset.addStatus);
      if (editButton) controller.openEdit(editButton.dataset.editId);
      if (deleteButton) controller.deleteTask(deleteButton.dataset.deleteId);
    });

    this.board.addEventListener("dragstart", (event) => {
      const card = event.target.closest("[data-task-id]");
      if (!card) return;
      event.dataTransfer.setData("text/plain", card.dataset.taskId);
      event.dataTransfer.effectAllowed = "move";
      requestAnimationFrame(() => card.classList.add("dragging"));
    });
    this.board.addEventListener("dragend", (event) => {
      event.target.closest("[data-task-id]")?.classList.remove("dragging");
      this.board.querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
    });
    this.board.addEventListener("dragover", (event) => {
      const column = event.target.closest(".column");
      if (!column) return;
      event.preventDefault();
      column.classList.add("drag-over");
    });
    this.board.addEventListener("dragleave", (event) => {
      const column = event.target.closest(".column");
      if (column && !column.contains(event.relatedTarget)) column.classList.remove("drag-over");
    });
    this.board.addEventListener("drop", (event) => {
      const column = event.target.closest(".column");
      if (!column) return;
      event.preventDefault();
      column.classList.remove("drag-over");
      const id = event.dataTransfer.getData("text/plain");
      if (id) controller.moveTask(id, column.dataset.status);
    });
  }

  getFormData() {
    return {
      id: document.querySelector("#task-id").value || undefined,
      title: document.querySelector("#task-title").value,
      description: document.querySelector("#task-description").value,
      priority: document.querySelector("#task-priority").value,
      status: document.querySelector("#task-status").value
    };
  }

  openDialog(task = null, defaultStatus = "todo") {
    this.form.reset();
    document.querySelector("#task-id").value = task?.id ?? "";
    document.querySelector("#task-title").value = task?.title ?? "";
    document.querySelector("#task-description").value = task?.description ?? "";
    document.querySelector("#task-priority").value = task?.priority ?? "medium";
    document.querySelector("#task-status").value = task?.status ?? defaultStatus;
    document.querySelector("#dialog-title").textContent = task ? "Editar tarea" : "Crear tarea";
    this.dialog.showModal();
    document.querySelector("#task-title").focus();
  }

  closeDialog() {
    this.dialog.close();
  }

  render(state) {
    const tasks = state.tasks.filter((task) => {
      const matchesSearch = `${task.title} ${task.description}`.toLowerCase().includes(this.filters.search);
      const matchesPriority = this.filters.priority === "all" || task.priority === this.filters.priority;
      return matchesSearch && matchesPriority;
    });

    for (const status of ["todo", "in-progress", "done"]) {
      const list = this.board.querySelector(`[data-list="${status}"]`);
      const columnTasks = tasks.filter((task) => task.status === status);
      this.board.querySelector(`[data-count="${status}"]`).textContent = columnTasks.length;
      list.innerHTML = columnTasks.length
        ? columnTasks.map((task) => this.#taskTemplate(task)).join("")
        : `<div class="empty-state">No hay tareas aquí todavía</div>`;
    }
    this.counter.textContent = `${tasks.length} ${tasks.length === 1 ? "tarea" : "tareas"}`;
  }

  #taskTemplate(task) {
    return `
      <article class="task-card" draggable="true" data-task-id="${escapeHTML(task.id)}">
        <span class="priority ${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
        <h3>${escapeHTML(task.title)}</h3>
        ${task.description ? `<p>${escapeHTML(task.description)}</p>` : ""}
        <footer class="card-footer">
          <span>Creada ${formatDate(task.createdAt)}</span>
          <span class="card-actions">
            <button type="button" data-edit-id="${escapeHTML(task.id)}" aria-label="Editar ${escapeHTML(task.title)}">Editar</button>
            <button type="button" data-delete-id="${escapeHTML(task.id)}" aria-label="Eliminar ${escapeHTML(task.title)}">Eliminar</button>
          </span>
        </footer>
      </article>`;
  }

  showToast(message) {
    this.toastElement.textContent = message;
    this.toastElement.classList.add("visible");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastElement.classList.remove("visible"), 2400);
  }
}
