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
  
  var knownDates = [];
  if (this.current && this.current > 0) {
    knownDates.unshift(this.current);
  }

  if (Array.isArray(dates)) {
    for (var date of dates) {
      if (!date) {
        continue;
      } else if (typeof date === 'object') {
        knownDates.unshift(date.getTime());
      } else if (typeof date === 'number') {
        knownDates.unshift(date);
      } else {
        throw "unknown date type";
      }
    }
  } else if (typeof dates === 'number') {
    knownDates.unshift(dates);
  } else if (typeof date === 'object') {
    knownDates.unshift(dates.getTime());
  } else if (typeof dates !== 'undefined') {
    throw 'Date is unexpected type of: ' + (typeof dates)
  }

  knownDates = knownDates.filter(val => val && val > 0);
  knownDates = knownDates.sort();
  if (knownDates.length > 0) {
    this.current = knownDates[0];
  } else {
    this.current = undefined;
  }

  return this.current;
}

module.exports = DateUtil;