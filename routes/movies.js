const router = require('express').Router();
const { moviePostValidation, movieIdValidation } = require('../middlewares/joiValidation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', moviePostValidation, createMovie);
router.delete('/:id', movieIdValidation, deleteMovie);

module.exports = router;
