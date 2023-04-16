exports.responseHeader = (req, res, next) => {
    console.log('path =>', req.path)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  };