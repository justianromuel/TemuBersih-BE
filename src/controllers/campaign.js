const { campaign, users, user_campaign } = require('../../models')

exports.joinCampaign = async (req, res) => {
    try {
        console.log('req.user:', req.user);
        const data = {
            name: req.body.name,
            description: req.body.description,
            location_name: req.body.location_name,
            location_url: req.body.location_url,
            person: req.body.person,
            date: req.body.date,
            start_hour: req.body.start_hour,
            end_hour: req.body.end_hour,
            target: req.body.target,
            image_url: req.file.filename,
            created_by: req.user.id
        }

        let newCampaign = await campaign.create(data)

        let campaignData = await campaign.findOne({
            where: {
                id: newCampaign.id
            },
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                {
                    model: users,
                    as: 'users',
                    through: {
                        model: user_campaign,
                        as: 'bridge',
                        attributes: [],
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            }
        })

        campaignData = JSON.parse(JSON.stringify(campaignData))

        res.send({
            status: 'success',
            data: {
                product: {
                    ...campaignData,
                    created_by: req.user.id,
                    image_url: process.env.FILE_PATH + campaignData.image_url
                }
            }
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}

exports.getCampaigns = async (req, res) => {
    try {
        let campaigns = await campaign.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        })

        campaigns = JSON.parse(JSON.stringify(campaigns))
        campaigns = campaigns.map((item) => {
            return {
                ...item,
                image_url: process.env.FILE_PATH + item.image_url
            }
        })

        if (!campaigns.length) {
            return res.send({
                message: 'There is no data, please add new data!.'
            })
        }

        res.send({
            status: 'success',
            data: {
                campaigns
            }
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}

exports.getDetailCampaign = async (req, res) => {
    try {
        const { id } = req.params

        let data = await campaign.findOne({
            where: { id },
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                {
                    model: users,
                    as: 'users',
                    through: {
                        model: user_campaign,
                        as: 'bridge',
                        attributes: [],
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        })

        data = JSON.parse(JSON.stringify(data))
        console.log("data:", data);
        data = {
            ...data,
            image_url: process.env.FILE_PATH + data.image_url
        }

        res.send({
            status: "success",
            data: {
                data
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}

exports.deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params

        const dataExist = await campaign.findOne({
            where: { id }
        })

        if (!dataExist) {
            return res.send({
                message: `Campaign with id: ${id} not found!`
            })
        }

        await campaign.destroy({
            where: {
                id,
            },
        })

        res.send({
            status: "success",
            message: `Delete campaign id: ${id} finished`,
            data: {
                id
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}