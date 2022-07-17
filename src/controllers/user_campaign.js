const { user_campaign, users, campaign } = require('../../models')

exports.joinUserCampaign = async (req, res) => {
    try {
        let user_id = req.user.id
        let campaign_id = req.params.id

        const data = {
            user_id: user_id,
            campaign_id: campaign_id
        }

        let newUserCampaign = await user_campaign.create(data)

        console.log('campaignData:', campaignData);
        res.send({
            status: 'success',
            message: 'Add userCampaign Success',
            data
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error"
        })
    }
}

exports.getUserCampaigns = async (req, res) => {
    try {
        let userCampaign = await user_campaign.findAll({
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                {
                    model: campaign,
                    as: 'campaign',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt',],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        userCampaign = JSON.parse(JSON.stringify(userCampaign))
        userCampaign = userCampaign.map((item) => {
            return {
                ...item,
                campaign: {
                    ...item.campaign,
                    image_url: process.env.FILE_PATH + item.campaign.image_url
                }
            }
        })

        if (!userCampaign.length) {
            return res.send({
                message: 'There is no data, please add new data!.'
            })
        }

        res.send({
            status: 'success',
            message: 'Get user_campaign Success',
            data: {
                userCampaign,
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error',
        })
    }
}
exports.getUserCampaignById = async (req, res) => {
    try {
        let { id } = req.params
        let userCampaign = await user_campaign.findAll({
            where: {
                campaign_id: id
            },
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'id'],
                    },
                },
                {
                    model: campaign,
                    as: 'campaign',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'id'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        userCampaign = JSON.parse(JSON.stringify(userCampaign))
        userCampaign = userCampaign.map((item) => {
            return {
                ...item,
                campaign: {
                    ...item.campaign,
                    image_url: process.env.FILE_PATH + item.campaign.image_url
                }
            }
        })

        if (!userCampaign.length) {
            return res.send({
                message: 'There is no data, please add new data!.'
            })
        }

        res.send({
            status: 'success',
            message: 'Get category Success',
            data: {
                userCampaign,
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error',
        })
    }
}