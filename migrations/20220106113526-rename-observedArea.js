module.exports = {
    async up(db, client) {
        await db
            .collection('devices')
            .aggregate([
                {
                    $addFields: {
                        datastreams: {
                            $map: {
                                input: '$datastreams',
                                as: 'datastream',
                                in: {
                                    $mergeObjects: [
                                        { observedArea: '$$datastream.observationArea' },
                                        {
                                            $arrayToObject: {
                                                $filter: {
                                                    input: { $objectToArray: '$$datastream' },
                                                    as: 'datastream',
                                                    cond: { $ne: ['$$datastream.k', 'observationArea'] },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $out: 'devices',
                },
            ])
            .toArray();
    },

    async down(db, client) {
        await db
            .collection('devices')
            .aggregate([
                {
                    $addFields: {
                        datastreams: {
                            $map: {
                                input: '$datastreams',
                                as: 'datastream',
                                in: {
                                    $mergeObjects: [
                                        { observationArea: '$$datastream.observedArea' },
                                        {
                                            $arrayToObject: {
                                                $filter: {
                                                    input: { $objectToArray: '$$datastream' },
                                                    as: 'datastream',
                                                    cond: { $ne: ['$$datastream.k', 'observedArea'] },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $out: 'devices',
                },
            ])
            .toArray();
    },
};
