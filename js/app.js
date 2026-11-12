import { Store } from "./core/store.js";
import { TaskRepository } from "./repositories/taskRepository.js";
import { TaskService } from "./features/tasks/taskService.js";
import { TaskView } from "./features/tasks/taskView.js";
import { TaskController } from "./features/tasks/taskController.js";

async function bootstrap() {
  const store = new Store({ tasks: [] });
  const repository = new TaskRepository();
  const service = new TaskService(store, repository);
  const view = new TaskView();
  const controller = new TaskController({ service, store, view });

  view.bind(controller);

  try {
    await controller.initialize();
  } catch (error) {
    console.error("Error al iniciar TaskFlow:", error);
    view.showToast("No se pudo iniciar la aplicación");
  }
}

bootstrap();
