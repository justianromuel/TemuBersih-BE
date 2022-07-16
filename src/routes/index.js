const express = require('express')
const router = express.Router()

// ========== Controllers ========== //
const { register, login, checkAuth } = require('../controllers/auth')
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/users')
const { addCampaign, getCampaigns, getDetailCampaign } = require('../controllers/campaign')

// ========== Middlewares ========== //
const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')

// ========== Route ========== //
// Authentication
router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth)

// Users
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', auth, updateUser)
router.delete('/user/:id', auth, deleteUser)

// Campaign
router.post('/campaign', auth, uploadFile('image_url'), addCampaign)
router.get('/campaigns', getCampaigns)
router.get('/campaign/:id', getDetailCampaign)

module.exports = router