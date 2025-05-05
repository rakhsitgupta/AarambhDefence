const deleteHandler = (req, res, next) => {
    if (req.method === 'DELETE') {
        // Ensure the request has a proper content-type
        if (!req.headers['content-type']) {
            req.headers['content-type'] = 'application/json';
        }
        
        // Handle empty body for DELETE requests
        if (!req.body || Object.keys(req.body).length === 0) {
            req.body = { _method: 'DELETE' };
        }
    }
    next();
};

module.exports = deleteHandler; 