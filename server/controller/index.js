const service = require('../service')

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await service.findByEmail({ email })
    if (!user || !user.validPassword(password)) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "Incorrect login or password",
            data: "Bad request"
        })
    }

    const payload = {
        id: user.id,
        username: user.username,
    }

    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    res.json({
        status: 'success',
        code: 200,
        data: {
            token,
        },
    })
}

const registration = async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = await service.findByEmail({ email })
    if (user) {
        return res.status(409).json({
            status: "error",
            code: 409,
            message: "Email is already in use",
            data: "Conflict"
        })
    }
    try {
        const newUser = new User({ username, email })
        newUser.setPassword(password)
        await newUser.save(
            res.status(201).json({
                status: 'success',
                code: 201,
                data: {
                    message: 'Registration successful',
                }
            })
        )
    } catch (error) {
        next(error)
    }
}

const user = (req, res, next) => {
  const { username } = req.user
  res.json({
    status: 'success',
    code: 200,
    data: {
      message: `Authorization was successful: ${username}`,
    },
  })
}

module.exports = {
    login, 
    registration,
    user
}