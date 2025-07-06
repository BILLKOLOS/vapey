const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Custom validation functions
const isValidObjectId = (value) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(value);
};

const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};

const isValidCurrency = (currency) => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];
  return validCurrencies.includes(currency.toUpperCase());
};

const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

// Sanitization middleware
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

// Rate limiting for specific actions
const createRateLimiter = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// File upload validation
const validateFileUpload = (allowedTypes, maxSize) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    if (allowedTypes && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }
    
    if (maxSize && req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
      });
    }
    
    next();
  };
};

// Pagination middleware
const pagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  req.pagination = {
    page,
    limit,
    skip
  };
  
  next();
};

// Search and filter middleware
const searchAndFilter = (req, res, next) => {
  const { search, sort, filter } = req.query;
  
  req.searchOptions = {};
  
  if (search) {
    req.searchOptions.search = search;
  }
  
  if (sort) {
    const [field, order] = sort.split(':');
    req.searchOptions.sort = { [field]: order === 'desc' ? -1 : 1 };
  }
  
  if (filter) {
    try {
      req.searchOptions.filter = JSON.parse(filter);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filter format'
      });
    }
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  isValidObjectId,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidAmount,
  isValidCurrency,
  isValidDate,
  sanitizeInput,
  sanitizeBody,
  createRateLimiter,
  validateFileUpload,
  pagination,
  searchAndFilter
}; 