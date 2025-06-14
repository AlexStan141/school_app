const User = require('./schemas/user')

const findByEmail = (email) => {
    return User.findOne({email})
}

module.exports = {
    findByEmail
}