/**
 * Format response data
 * @param {Object} data - The data to include in the response
 * @param {string} msg - Message to include
 * @param {number} code - Response code (0 means success)
 * @returns {Object} - Formatted response
 */
exports.formatResponse = (data, msg = "success", code = 0) => {
  return {
    code,
    msg,
    data
  };
};
