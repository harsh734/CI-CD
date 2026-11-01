const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const { asyncHandler } = require('../../utils/asyncHandler');
const { authRequired } = require('../../middlewares/authRequired');
const { validateOnboarding } = require('../../middlewares/validateUser');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile endpoints
 */

/**
 * @swagger
 * /api/users/me/onboarding:
 *   patch:
 *     summary: Update the current user's onboarding completion flag
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [completed]
 *             properties:
 *               completed: { type: boolean }
 *     responses:
 *       200: { description: Onboarding status updated }
 *       400: { description: Invalid payload }
 *       401: { description: Unauthorized }
 */
router.patch(
  '/me/onboarding',
  authRequired,
  validateOnboarding,
  asyncHandler(UserController.updateOnboarding)
);

module.exports = router;
