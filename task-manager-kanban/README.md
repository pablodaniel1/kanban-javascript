# TaskFlow — Kanban con JavaScript Vanilla

Aplicación Kanban responsive construida sin frameworks ni dependencias de runtime.

## Requisitos
- Navegador moderno con soporte para ES Modules, `structuredClone`, `crypto.randomUUID` y Drag & Drop.
- Un servidor HTTP local para servir los módulos ES (no abrir `index.html` directamente con `file://`).

## Ejecutar
Desde la carpeta del proyecto:

```bash
python -m http.server 5500
```

Abre `http://localhost:5500`.

También puedes usar la extensión Live Server de VS Code.

## Funcionalidades
- Crear, editar y eliminar tareas.
- Tres columnas: Por hacer, En progreso y Completadas.
- Drag & Drop entre columnas.
- Filtro por prioridad y búsqueda por título/descripción.
- Persistencia en LocalStorage.
- Diseño responsive.

## Arquitectura
- `core/store.js`: estado centralizado y suscripciones (Observer).
- `repositories/taskRepository.js`: persistencia (Repository).
- `features/tasks/taskService.js`: reglas de negocio y validaciones.
- `features/tasks/taskController.js`: coordina acciones entre vista y servicio.
- `features/tasks/taskView.js`: renderizado y eventos del DOM.
- `utils/helpers.js`: funciones puras reutilizables.

## Decisiones técnicas
Se utiliza una arquitectura modular orientada a funcionalidades, con separación entre vista, coordinación, lógica de negocio, estado y persistencia. No es MVC estricto: combina responsabilidades de presentación y aplicación con Store/Observer y Repository para mantener bajo el acoplamiento.

Para producción se recomienda añadir pruebas automatizadas, manejo de migraciones del esquema de LocalStorage, accesibilidad adicional y una API backend si se requiere sincronización multiusuario.
