const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Event extends Model {}

    Event.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        createdBy: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',  // Ensure your 'Users' table is correctly defined
                key: 'id',
            },
        },
    }, {
        sequelize, // ✅ Ensure sequelize instance is passed
        modelName: "Event",
        tableName: "Events",  // Explicitly define the table name
        timestamps: true,  // Enable timestamps (createdAt, updatedAt)
    });

    return Event;
};
