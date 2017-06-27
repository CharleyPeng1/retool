'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.changeColumn(
      'users',
      'googleToken',
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'googleToken',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  }
};
