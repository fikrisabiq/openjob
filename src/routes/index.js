import { Router } from 'express';
import users from '../modules/users/users-routes.js';
import authentications from '../modules/authentications/authentications-routers.js';
import companies from '../modules/companies/companies-routes.js';
import categories from '../modules/categories/categories-routes.js';
import jobs from '../modules/jobs/jobs-routes.js';
import applications from '../modules/applications/applications-routes.js';
import bookmarks from '../modules/bookmarks/bookmarks-routes.js';
import profile from '../modules/profile/profile-routes.js';
import documents from '../modules/documents/documents-routes.js';


const router = Router();

router.use('/', users);
router.use('/', authentications);
router.use('/', companies);
router.use('/', categories);
router.use('/', jobs);
router.use('/', applications);
router.use('/', bookmarks);
router.use('/', profile);
router.use('/', documents);

export default router;