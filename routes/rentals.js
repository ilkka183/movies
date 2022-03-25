const express = require('express');
const db = require('../common/mySQL/sqlDatabase');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const Rental = require('../models/rental');

const entity = new Rental(db);
const router = express.Router();

router.get('/', async (req, res, next) => await entity.processGetAll(req, res, next));
router.get('/:id', async (req, res, next) => await entity.processGetById(req, res, next));
router.post('/', [auth], async (req, res, next) => await entity.processPost(req, res, next));
router.patch('/:id', [auth], async (req, res, next) => await entity.processPatch(req, res, next));
router.delete('/:id', [auth, admin], async (req, res, next) => await entity.processDelete(req, res, next));

module.exports = router;
