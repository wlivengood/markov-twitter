'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sampleStdev = exports.sampleVariance = exports.stdev = exports.variance = undefined;
exports.sampleCovariance = sampleCovariance;
exports.sampleCorrelation = sampleCorrelation;

var _descriptive = require('./descriptive');

/**
 * Function computing the sample variance of the given sequence.
 *
 * @param  {number}  ddof     - Delta degrees of freedom.
 * @param  {array}   sequence - The sequence to process.
 * @return {number}           - The variance.
 *
 * @throws {Error} - The function expects a non-empty list.
 */
function genericVariance(ddof, sequence) {
  var length = sequence.length;

  if (!length) throw Error('talisman/stats/inferential#variance: the given list is empty.');

  // Returning 0 if the denominator would be <= 0
  var denominator = length - ddof;

  if (denominator <= 0) return 0;

  var m = (0, _descriptive.mean)(sequence);

  var s = 0;

  for (var i = 0; i < length; i++) {
    s += Math.pow(sequence[i] - m, 2);
  }return s / denominator;
}

/**
 * Function computing the sample standard deviation of the given sequence.
 *
 * @param  {number}  ddof     - Delta degrees of freedom.
 * @param  {array}   sequence - The sequence to process.
 * @return {number}           - The variance.
 *
 * @throws {Error} - The function expects a non-empty list.
 */
/**
 * Talisman stats/inferential
 * ===========================
 *
 * The library's inferential stats helpers.
 */
function genericStdev(ddof, sequence) {
  var v = genericVariance(ddof, sequence);

  return Math.sqrt(v);
}

/**
 * Exporting convenient methods.
 */
var sampleVariance = genericVariance.bind(null, 1),
    sampleStdev = genericStdev.bind(null, 1);

/**
 * Function computing the sample covariance.
 *
 * @param  {array}  x - First sequence.
 * @param  {array}  y - Second sequence.
 * @return {number}   - The sample covariance.
 *
 * @throws {Error} - The function expects two equal-length lists.
 * @throws {Error} - The function expects lists containing more than one item.
 */
function sampleCovariance(x, y) {
  if (x.length !== y.length) throw Error('talisman/stats/inferential#sampleCovariance: this function expects two sequences of same size.');

  if (x.length <= 1) throw Error('talisman/stats/inferential#sampleCovariance: the given lists should contain more than one item.');

  var xMean = (0, _descriptive.mean)(x),
      yMean = (0, _descriptive.mean)(y),
      n = x.length;

  var sum = 0;

  for (var i = 0; i < n; i++) {
    sum += (x[i] - xMean) * (y[i] - yMean);
  }return sum / (n - 1);
}

/**
 * Function computing the sample correlation coefficient.
 *
 * @param  {array}  x - First sequence.
 * @param  {array}  y - Second sequence.
 * @return {number}   - The sample correlation coefficient.
 */
function sampleCorrelation(x, y) {
  var covariance = sampleCovariance(x, y);

  return covariance / (sampleStdev(x) * sampleStdev(y));
}

exports.variance = genericVariance;
exports.stdev = genericStdev;
exports.sampleVariance = sampleVariance;
exports.sampleStdev = sampleStdev;