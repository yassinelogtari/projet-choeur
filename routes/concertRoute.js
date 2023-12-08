
const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concertController');

router.post('/addconcert', concertController.createConcert);
router.get('/', concertController.getConcerts);
router.get('/:id', concertController.getConcertById);
router.put('/:id', concertController.updateConcertById);
router.delete('/:id', concertController.deleteConcertById);
module.exports = router;
