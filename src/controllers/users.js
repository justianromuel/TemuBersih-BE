const { users } = require("../../models");

exports.getUsers = async (req, res) => {
    try {
        const user = await users.findAll({
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
        });

        res.send({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await users.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
        });

        res.send({
            status: "success",
            data: {
                user: data,
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await users.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
        });

        await users.update(req.body, {
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Update user id: ${id} finished`,
            data: req.body,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await users.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Delete user id: ${id} finished`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};
