const express = require('express');

const { handleLoginUser,
    handleSignUpUser,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleDemoteUserToAdmin,
    handlePromoteUserToAdmin,
    handleGetAllUser,
    handleLogOut,
    handleGetTotalUsersCount,
    handleVerifyUserCredentials
} = require('../controllers/userController');

const authenticateJWT = require('../middlewares/authenticateJWT');
const { hashSync } = require('bcrypt');

const router = express.Router();

router.post('/login', handleLoginUser);

router.post('/signup', handleSignUpUser);

// Logout route
router.get('/logout', handleLogOut);

router.get('/', authenticateJWT, handleGetAllUser);

router.post('/verify', handleVerifyUserCredentials);

router.get('/totalUsersCount', handleGetTotalUsersCount);

router.route('/:id')
    .get( handleGetUserById)
    .patch( handleUpdateUserById)
    .delete(authenticateJWT, handleDeleteUserById);


    // Promote a user to admin (Admin only)
router.put('/promote/:id',authenticateJWT, handlePromoteUserToAdmin);
  
  // Demote a user from admin (Admin only)
  router.put('/demote/:id', authenticateJWT, handleDemoteUserToAdmin);

  
module.exports = router;