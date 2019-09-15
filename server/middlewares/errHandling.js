module.exports = function(err, req, res, next) {
    console.log(err);
    if (err.code === 404) {
      res.status(404).json({
        message: 'Resource Not Found',
      });
    } else if (err.name === 'ValidationError') {
      const errors =  {
        message: err.message,
        path: err.path,
      };
      res.status(400).json({
        errors,
      });
    } else if (err.status === 403) {
      console.log(err.name)
      res.status(403).json({
        message: 'Not Authorized Page',
      });
    
    } else if (err.name === 'JsonWebTokenError') {
      res.status(400).json({
        message: err.message
      });
    }
    else {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
}