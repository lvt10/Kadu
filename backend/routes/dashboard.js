'use strict'
const router           = require('express').Router()
const auth             = require('../middleware/auth')
const DashboardService = require('../services/DashboardService')

router.get('/', auth, (req, res) => {
  res.json(DashboardService.getSummary(req.user.id))
})

module.exports = router