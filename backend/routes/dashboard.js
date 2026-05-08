'use strict'
// routes/dashboard.js
const router   = require('express').Router()
const auth     = require('../middleware/auth')
const DashboardService = require('../services/DashboardService')

router.get('/', auth, (req, res) => {
  res.json(DashboardService.getSummary())
})

module.exports = router
