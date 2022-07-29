const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { signupValidation, signinValidation } = require('../middlewares/joiValidation');
const { createUser, login, signout } = require('../controllers/user');

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', signout);

module.exports = router;
