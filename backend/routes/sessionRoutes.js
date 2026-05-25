const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Define API Endpoints
router.post('/start', sessionController.startSession);
router.post('/:id/inclusion', sessionController.submitInclusion);
router.post('/:id/exclusion', sessionController.submitExclusion);
router.post('/:id/pause', sessionController.pauseSession);
router.post('/:id/resume', sessionController.resumeSession);
router.post('/:id/score', sessionController.submitScore);
router.post('/:id/select-score', sessionController.submitScore); // Alias to support both configurations

module.exports = router;
