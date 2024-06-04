const mongoose = require('mongoose');

const datamethod = ['body', 'params', 'query', 'headers'];
const { Schema } = mongoose;

function validation2(Schema) {
    return (req, res, next) => {
        const validationArr = [];
        datamethod.forEach(key => {
            if (Schema[key]) {
                const validations = Schema[key].validate(req[key], { abortEarly: false });
                if (validations.error) {
                    validationArr.push(validations.error);
                }
            }
        });

        if (validationArr.length > 0) {
            return res.status(400).json({ message: "Validation error", validationArr });
        }
        next();
    };
}

module.exports = validation2;