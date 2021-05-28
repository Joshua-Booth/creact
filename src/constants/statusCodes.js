/**
 * Action types for reducers.
 *
 * @file statusCodes.js
 * @module constants - HTTP status codes
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

/** @constant {object} */
export const SUCCESS_STATUS_CODES = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
};

/** @constant {object} */
export const REDIRECT_STATUS_CODES = {
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
};

/** @constant {object} */
export const CLIENT_ERROR_STATUS_CODES = {
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Request Entity Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Requested Range Not Satisfiable",
  417: "Expectation Failed",
};

/** @constant {object} */
export const SERVER_ERROR_STATUS_CODES = {
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
};

/** @constant {object} */
export const HTTP_STATUS_CODES = {
  ...SUCCESS_STATUS_CODES,
  ...REDIRECT_STATUS_CODES,
  ...CLIENT_ERROR_STATUS_CODES,
  ...SERVER_ERROR_STATUS_CODES,
};

/** @constant {object} */
export const ERROR_STATUS_CODES = {
  ...CLIENT_ERROR_STATUS_CODES,
  ...SERVER_ERROR_STATUS_CODES,
};
