const passGlobalDataToViews = (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.title = 'PinHigh';
    next();
}

module.exports = passGlobalDataToViews;