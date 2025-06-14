const express = require("express")
const router = express.Router()
const passport = require('passport')
const ctrlUser = require('../controller')

const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (!user || err) {
            return res.status(401).json({
                status: "error",
                code: 401,
                message: "Unauthorized",
                data: "Unauthorized"
            })
        }
        req.user = user;
        next()
    })(req, res, next)
}

router.post('/login', ctrlUser.login)
router.post('/registration', ctrlUser.registration)
router.get('/user', auth, ctrlUser.user)

module.exports = router