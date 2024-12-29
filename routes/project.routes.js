import { Router } from 'express';
import {body} from 'express-validator';
import * as projectcontroller from '../controllers/project.controller.js';
import * as authMiddleware from "../middleware/auth.middleware.js";


const router = Router();

router.post('/create',authMiddleware.authUser,// check user loggedin or not
    body('name').isString().withMessage("Name is not in string"),projectcontroller.createProject
);

router.get('/all',authMiddleware.authUser,
    projectcontroller.getallproject

);
router.put('/add-user',   // add already created project to anotheruser too
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
        projectcontroller.addUserToProject
)

router.get('/get-project/:projectId',
    authMiddleware.authUser,
    projectcontroller.getProjectById
)


router.put('/update-file-tree',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectcontroller.updateFileTree
)

export default router;