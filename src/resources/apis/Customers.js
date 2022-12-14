const { Customers } = require('../models');

const API_Customers = {
    create: async (data) => {
        return await new Customers(data).save();
    },

    readOne: async (loaders) => {
        return await Customers.findOne(loaders).lean();
    },

    readMany: async (loaders, options) => {
        let skip = options.skip || 0;
        let limit = options.limit || 0;
        let select = options.select || {};
        return await Customers.find(loaders)
            .select(select)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
    },

    update: async (id, data) => {
        return await Customers.findByIdAndUpdate(id, { $set: data });
    },

    remove: async (id) => {
        return await Customers.findByIdAndRemove(id);
    },
};

module.exports = API_Customers;