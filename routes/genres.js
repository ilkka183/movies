const express = require('express');
const connection = require('../connection');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateId');
const Genre = require('../models/genre');

const router = express.Router();
const entity = new Genre(connection);

router.get('/', async (req, res, next) => await entity.restGet(req, res, next));
router.get('/:id', [validateId], async (req, res, next) => await entity.restGetId(req, res, next));
router.post('/', [auth], async (req, res, next) => await entity.restPost(req, res, next));
router.patch('/:id', [auth, validateId], async (req, res, next) => await entity.restPatch(req, res, next));
router.delete('/:id', [auth, /* admin, */ validateId], async (req, res, next) => await entity.restDelete(req, res, next));

module.exports = router;
