const router = require('express').Router();
const { updateUserValidation } = require('../middlewares/joiValidation');
const { getUserData, updateUserData } = require('../controllers/user');

router.get('/me', getUserData);
router.patch('/me', updateUserValidation, updateUserData);

module.exports = router;
