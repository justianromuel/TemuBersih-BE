const { user_campaign, users, campaign } = require('../../models')

exports.joinUserCampaign = async (req, res) => {
    try {
        let user_id = req.user.id
        let campaign_id = req.params.id
        console.log("user_id:", user_id);
        const data = {
            user_id: user_id,
            campaign_id: campaign_id
        }

        let newUserCampaign = await user_campaign.create(data)
        console.log('newUserCampaign:', newUserCampaign);
        let usersData = await users.findOne({
            where: {
                id: user_id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            }
        })
        console.log('usersData:', usersData);
        let campaignData = await campaign.findOne({
            where: {
                id: campaign_id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            }
        })
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
        const userCampaign = await user_campaign.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
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
        const userCampaign = await user_campaign.findAll({
            where: {
                campaign_id: id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
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