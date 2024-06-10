import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  res.send('Tasks route');
});

export { router as v1TasksRouter };
