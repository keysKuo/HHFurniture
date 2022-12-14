const { Orders } = require('../models');

const API_Orders = {
    create: async (data) => {
        return await new Orders(data).save();
    },

    readOne: async (loaders) => {
        return await Orders.findOne(loaders)
        .populate('customer')
        .lean();
    },

    readMany: async (loaders, options) => {
        let skip = options.skip || 0;
        let limit = options.limit || 0;
        let select = options.select || {};
        return await Orders.find(loaders)
            .select(select)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('customer')
            .lean();
    },

    update: async (id, data) => {
        return await Orders.findByIdAndUpdate(id, { $set: data });
    },

    remove: async (id) => {
        return await Orders.findByIdAndRemove(id);
    },

    count: async () => {
        return await Orders.countDocuments({});
    }
};

module.exports = API_Orders;