var request = require('request');
var lo_ = require('lodash');
var categories = require('../assets/categories.json');
var licenseData = require('../assets/licenses.json');

var categoriesParsed;

exports.computeRequiredLicenses = function computeRequiredLicenses(names, country) {

  if(!categoriesParsed) {
    categoriesParsed = [];
    for(var i = 0; i < categories.length; i++) {
      categoriesParsed[categories[i].item] = categories[i].category;
    }
  }

  var licenses = [];
  for(var j = 0; j < names.length; j++) {
    var result = lo_.findWhere(licenseData, {'category': categoriesParsed[names[j]], 'country': country}, 'name');
    if(result !== undefined) licenses.push(result.name);
  }

  licenses = lo_.filter(licenses, function(n) {
    return n !== undefined;
  });

  if(licenses.length !== 0) {
    return lo_.uniq(licenses);
  } else {
    return {};
  }
};
