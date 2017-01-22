'use strict';

module.exports = function (sequelize, DataTypes) {
	var Answer = sequelize.define('Answer', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		text: {
			type: DataTypes.TEXT,
			validate: {
				notEmpty: true
			}
		},
		positiveVotes: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		negativeVotes: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	},
		{
			classMethods: {
				associate: function (models) {
					Answer.belongsTo(models.Question, {
						onDelete: "CASCADE",
						foreignKey: {
							allowNull: false
						}
					});

					Answer.belongsTo(models.User, {
						onDelete: "SET NULL",
						as: "createdByUser"
					});

					Answer.belongsToMany(models.User, {
						through: models.AnswerVote,
						timestamps: false
					});
				}
			}
		});

	return Answer;
};