const path = require('path');
const express = require('express');

const kanbanController = require('../controllers/kanban');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

const router = express.Router();

router.get('/',  kanbanController.getResources);

router.get('/addResource', isAuth, kanbanController.getaddResource);

router.get('/admin/resources', isAuth, kanbanController.getAdminResources);

router.post('/kanbanApproval', isAuth, kanbanController.approvedKanban);

router.post('/addResource', kanbanController.postaddResource);

router.post('/delete-resource', kanbanController.postDeleteResource);

router.get('/update-resource/:kanbanId', isAuth, kanbanController.getEditResource);

router.get('/resource', isAuth,  kanbanController.getSearch);

router.post('/update-resource', kanbanController.postEditResource);

module.exports = router;