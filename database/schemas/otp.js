var { sequelize, DataTypes } = require('../db')

var OTPDb = sequelize.define('otp_token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize
});

module.exports = { OTPDb };
