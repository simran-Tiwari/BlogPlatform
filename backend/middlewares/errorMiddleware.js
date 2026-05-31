const errorHandler = (req, res, next, err)=>{
    res.status(err.status || 500).json({
        success:false,
        message:err.message || "Internal server error, Please try again later"
    });
};

module.exports = errorHandler;