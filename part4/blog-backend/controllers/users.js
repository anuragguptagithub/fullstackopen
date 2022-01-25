const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/',async (request, response) => {

    const salt = 10
    const encryptedPassword = await bcrypt.hash(request.body.password, salt)

    const user = new User({
                    username: request.body.username,
                    name: request.body.name,
                    passwordHash: encryptedPassword
    })

    response.json(await user.save())
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
  })

module.exports = usersRouter