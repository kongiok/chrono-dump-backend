import { Router } from "express";
import { hasLogin } from "../../middlewares/v1/auth.middleware.js";
import { createTask } from "../../models/v1/tasks.model.js";
import { verifyToken } from "../../services/v1/auth.service.js";
import { getTasksByUserID } from "../../services/v1/tasks.service.js";

const router = Router();

router.get('/', async (req, res) => {
  // const { client_id } = await verifyToken(req.headers.authorization.split(' ')[1]).payload;
  const client_id = "01b7bd6c-ff95-4370-80ad-0e609b75d903";
  const tasks = await getTasksByUserID(client_id);
  return res.status(200).send({ tasks });
  // const [schema, token] = req.headers.authorization.split(' ');
  // const verifiedToken = await verifyToken(token);

  // res.send({ token })
});

router.post('/', hasLogin, async (req, res) => {
  const title = req.body.title || '';
  const description = req.body.description || '';
  const deadline = req.body.deadline || 0;
  const status = req.body.status || 0;
  const priority = req.body.priority || 0;
  const parent_task = req.body.parent_task || 0;
  const user_id = req.body.user_id || '';
  const time_spent = req.body.time_spent || 0;
  const taskAppend = await createTask({ title, description, deadline, status, priority, parent_task, user_id, time_spent });
  return res.status(201).send(taskAppend);
});

router.get('/:id', hasLogin, async (req, res) => {
  const { client_id } = await verifyToken(req.headers.authorization.split(' ')[1]).payload;
  const task = await getTaskByID(req.params.id, client_id);
  res.send('Tasks route');
  return res.send({ task });
});

router.patch('/:id', hasLogin, async (req, res) => {
  const { client_id } = await verifyToken(req.headers.authorization.split(' ')[1]).payload;
  const task = await getTaskByID(req.params.id, client_id);
  if (!task) {
    return res.status(404).send('Task not found');
  }
  const title = req.body.title || task.title;
  const description = req.body.description || task.description;
  const deadline = req.body.deadline || task.deadline;
  const status = req.body.status || task.status;
  const priority = req.body.priority || task.priority;
  const parent_task = req.body.parent_task || task.parent_task;
  const user_id = req.body.user_id || task.user_id;
  const time_spent = req.body.time_spent || task.time_spent;
  const taskUpdated = await updateTaskByID(req.params.id, { title, description, deadline, status, priority, parent_task, user_id, time_spent });
  return res.status(200).send(taskUpdated);
});

router.delete('/:id', hasLogin, async (req, res) => {
  const { client_id } = await verifyToken(req.headers.authorization.split(' ')[1]).payload;
  const task = await getTaskByID(req.params.id, client_id);
  if (!task) {
    return res.status(404).send('Task not found');
  }
  await deleteTaskByID(req.params.id);
  return res.status(204).send({ msg: 'Task deleted' });
});

export { router as v1TasksRouter };
