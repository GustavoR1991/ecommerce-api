import { Router } from 'express';
import * as useController from '../controllers/useController';

const router = Router();

router.get('/', useController.listUsers);
router.get('/:id', useController.getUserById);
router.post('/', useController.createUser);
router.put('/:id', useController.updateUser);
router.delete('/:id', useController.deleteUser);

export default router;