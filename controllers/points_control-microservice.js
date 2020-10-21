const student = require("./../models/student");
const logger = require("./../config/logger")
module.exports = {
    addPoints: async (studentid) => {
        return new Promise(async (resolve, reject) => {
            student.findOne({emailID: studentid}, async (err, obj) => {
                if (err) {
                    logger.error(err);
                    resolve(false);
                } else {
                    if (obj !== {} && obj !== null) {
                        logger.debug(obj);
                        student.updateOne(
                            {emailID: studentid},
                            {totalInteractionPoints: obj["totalInteractionPoints"] + 2},
                            async (err2, obj2) => {
                                if (err2) {
                                    logger.error(err);
                                    resolve(false);
                                } else {
                                    logger.debug(obj);
                                    resolve(true);
                                }
                            }
                        );
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    },

    sendPoints: async (studentid) => {
        return new Promise(async (resolve, reject) => {
            student.findOne(
                {emailID: studentid},
                {totalInteractionPoints: 1},
                async (err, obj) => {
                    if (err) {
                        console.error(err);
                    } else {
                        resolve(obj);
                    }
                }
            );
        });
    },
};
