const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }));
      return res.status(400).json({ errors });
    }

    // Special handling for business owner details
    if (req.body.role === 'businessOwner' && !req.body.businessDetails) {
      return res.status(400).json({
        errors: [{
          field: 'businessDetails',
          message: 'Business details are required for business owners'
        }]
      });
    }

    // Special handling for funding entity details
    if (req.body.role === 'fundingEntity' && !req.body.fundingDetails) {
      return res.status(400).json({
        errors: [{
          field: 'fundingDetails',
          message: 'Funding details are required for funding entities'
        }]
      });
    }

    next();
  };
};

module.exports = validate; 