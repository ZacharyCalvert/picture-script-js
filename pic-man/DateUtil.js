function DateUtil(current) {
  if (typeof current === 'undefined') {
    this.current = 0;
  } else if (typeof current === 'number') {
    this.current = current;
  } else {
    this.current = current.getTime();
  }
}

DateUtil.prototype.update = function (numericalTime) {
  if (!numericalTime || numericalTime <= 0) {
    return;
  }
  if (this.current > 0) {
    this.current = Math.min(this.current, numericalTime);
  } else {
    this.current = numericalTime;
  }
  return this.current;
}

DateUtil.prototype.getEarliestDate = function (dates) {
  if (Array.isArray(dates)) {
    var numerical = dates.map(function (date) {
      if (typeof date === 'object') {
        return date.getTime();
      } else {
        return date;
      }
    });
    for (const date of numerical) {
      this.update(date);
    }
  } else if (typeof dates === 'number') {
    this.update(dates);
  } else if (typeof dates === 'object') {
    this.update(dates.getTime());
  } else if (typeof dates !== 'undefined') {
    throw 'Date is unexpected type of: ' + (typeof dates)
  }

  return this.current;
}

module.exports = DateUtil;