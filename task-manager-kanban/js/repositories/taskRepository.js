const STORAGE_KEY = "taskflow.tasks.v1";

/**
 * Repository Pattern:
 * la aplicación no necesita conocer cómo se almacenan los datos.
 * En el futuro podemos reemplazar LocalStorage por una API REST.
 */
export class TaskRepository {
  async getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("No se pudieron recuperar las tareas:", error);
      return [];
    }
  }

  async saveAll(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("No se pudieron guardar las tareas:", error);
      throw new Error("No fue posible guardar los cambios en el navegador.");
    }
  }
}
