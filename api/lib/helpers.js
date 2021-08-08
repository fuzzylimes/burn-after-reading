const validateUuid = require('uuid-validate');

/**
 * Checks if value is a valid uuid
 * @param {string} value incoming user query
 * @return {boolean} if value is a uuid
 */
exports.isValidUuid = (value) => {
    return validateUuid(value, 4);
}