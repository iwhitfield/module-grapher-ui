var async = require('async');
var counts = require('npm-download-counts');
var http = require('http');
var moment = require('moment');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        version: require('../package.json').version
    })
});

/* GET specific module. */
router.get('/:module', function(req, res) {
    var mapping = { };

    var months = [];

    var month = moment.utc().subtract(1, 'year').startOf('month');
    for(var i = 0; i < 12; i++){
        month.add(1, 'month');
        months.push(moment(month));
        mapping[moment(month).format('MMMM')] = 0;
    }

    var data = {
        labels: [],
        datasets: [
            {
                label: "Download Counts",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }
        ]
    };

    var monthlyFunctions = months.map(function(month){
        return createFunctionForMonth(mapping, month, req.params.module);
    });

    async.parallel(monthlyFunctions, function(){
        data.labels = Object.keys(mapping);
        data.datasets[0].data = data.labels.map(function(k){
            return mapping[k];
        });
        res.render('module', {
            data: data,
            pkg: req.params.module,
            total: data.datasets[0].data.reduce(function(a, b){
                return a + b;
            })
        });
    });
});

module.exports = router;

function createFunctionForMonth(mapping, month, pkg){
    return function(cb){
        counts(pkg, month.toDate(), moment(month).endOf('month').toDate(), function (err, d) {
            if(!err){
                var count = 0;
                d.forEach(function(f){
                    count += f.count;
                });
                mapping[month.format('MMMM')] = count;
            }
            cb();
        });
    }
}