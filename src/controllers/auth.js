const { users } = require('../../models')

const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    // our validation schema here
    const schema = Joi.object({
        full_name: Joi.string().min(2).required(),
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(6).max(12).required()
    })

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body)

    // if error exist send validation error message
    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message
            }
        })
    }

    try {
        const userExist = await users.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        })

        // return console.log(userExist);
        if (userExist) {
            return res.send({
                status: 'failed',
                message: 'Email already exist'
            })
        }
        // we generate salt (random value) with 10 rounds
        const salt = await bcrypt.genSalt(10)
        // we hash password from request with salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = await users.create({
            full_name: req.body.full_name,
            email: req.body.email,
            password: hashedPassword,
        })

        // generate token
        const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: 'success',
            data: {
                user: {
                    full_name: newUser.full_name,
                    email: newUser.email,
                    token
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.login = async (req, res) => {
    // our validation schema here
    const schema = Joi.object({
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(6).max(12).required(),
    })

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body)

    // if error exist send validation error message
    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message
            }
        })
    }

    try {
        const userExist = await users.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        })

        // return console.log(userExist)
        if (!userExist) {
            return res.status(400).send({
                status: 'failed',
                message: 'Email belum terdaftar'
            })
        }

        // compare password between entered from client and from database
        const isValid = await bcrypt.compare(req.body.password, userExist.password)

        // check if not valid then return response with status 400 (bad request)
        if (!isValid) {
            return res.status(400).send({
                status: 'failed',
                message: 'Credential is invalid'
            })
        }

        // generate token
        const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: 'success',
            data: {
                user: {
                    id: userExist.id,
                    full_name: userExist.full_name,
                    email: userExist.email,
                    token
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id

        const dataUser = await users.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        })

        if (!dataUser) {
            return res.status(404).send({
                status: "failed",
            })
        }

        res.send({
            status: "success",
            data: {
                user: {
                    id: dataUser.id,
                    full_name: dataUser.full_name,
                    email: dataUser.email,
                },
            },
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            status: "failed",
            message: "Server Error",
        })
    }
}