var model = require('./model');
var categories = require('../assets/categories.json');
var licenses = require('./licenses.js');

function computeTotal(order) {
    // basic sanity check
    if (!order.prices || !order.quantities || !order.country || !order.reduction) {
        console.log('ERROR: MISSING ONE OR SEVERAL PARAMETERS', order);
        return {};
    }

    // check arrays length
    var count = order.prices.length;
    if (order.prices.length !== order.quantities.length) {
        console.log('ERROR: NOT SAME NUMBER OF PRICES & QUANTITIES');
        return {};
    }

    // retrieve & check VAT
    var vat = model.computeVAT(order.country);
    if (vat === null) {
        console.log('ERROR: CANNOT FIND VAT FOR COUNTRY: ', order.country);
        return {};
    }

    // compute total before tax
    var total = 0;
    for(var idx = 0; idx < count; idx ++) {
      if (order.prices[idx] < 0) {
        console.log('ERROR: ITEM PRICE IS NEGATIVE: ', order.prices);
        return {};
      }

      if (order.quantities[idx] < 0) {
        console.log('ERROR: ITEM QUANTITY IS NEGATIVE: ', order.quantities);
        return {};
      }

      total += order.prices[idx] * order.quantities[idx];
    }

    var orderLicenses = licenses.computeRequiredLicenses(order.names, order.country);

    // add VAT
    var total_vat = total * ( 1 + vat);

    // retrieve & check discount
    var discount = model.computeDiscount(total_vat, order.reduction);
    if (discount === null) return {};

    // compute final price
    var discounted = total_vat * (1 - discount);

    // log for clarity and debug purpose
    var audit = {
        count: count,
        total: total,
        vat: vat,
        total_vat: total_vat,
        discount: discount,
        discounted: discounted
    };
    console.log(audit);

    return {total: discounted, licenses: orderLicenses};
}

function processCategoriesAPI(order) {
  return categories;
}

function processVouchersAPI(order) {
  return {};
}

function processLicensesAPI(order) {
  return {};
}

exports.order = function order(input, onResult) {
    onResult(null, computeTotal(input));
};

exports.categories = function categories(input, onResult) {
    onResult(null, processCategoriesAPI(input));
};

exports.vouchers = function vouchers(input, onResult) {
    onResult(null, processVouchersAPI(input));
};

exports.licenses = function licenses(input, onResult) {
    onResult(null, processLicensesAPI(input));
};
