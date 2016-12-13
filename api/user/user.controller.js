var exporter = {};

exporter.index = function (req, res, next) {
    res.json({val:1});
};

module.exports = exporter;