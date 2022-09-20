const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const productTypes = sequelize.define("producttypes", {
    typeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
        type:  DataTypes.BOOLEAN,
        allowNull: false,
    }
});

const quality = sequelize.define("quality", {
    qualityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profitType: {
       type:  DataTypes.STRING,
       allowNull: false,
    },
    profitValue: {
        type:  DataTypes.DOUBLE,
        allowNull: false,
    },
    isDeleted: {
        type:  DataTypes.BOOLEAN,
        allowNull: false,
    }
});

const warehouse = sequelize.define("warehousedetails", {
    whName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whCapacity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPerson: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type:  DataTypes.BOOLEAN,
        allowNull: false,
    }
});

const shopdetails = sequelize.define("shopdetails", {
    shName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    shCapacity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPerson: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type:  DataTypes.BOOLEAN,
        allowNull: false,
    }
});
  
module.exports = {
    ProductType: productTypes,
    Quality: quality,
    WareHouse: warehouse,
    ShopDetails: shopdetails
};