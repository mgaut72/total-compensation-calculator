function getBaseSalaryPerYear(raisesWithMoments) {
  const raises = raisesWithMoments.map(r => ({effectiveDate: r.effectiveDate.toDate(), salary: r.salary}));
  console.log(raises);
  var salaries = [];
  var startYear = 10000000;
  var endYear = 0;
  for (var i = 0; i < raises.length; i++) {
    startYear = Math.min(startYear, raises[i].effectiveDate.getFullYear());
    endYear = Math.max(endYear, raises[i].effectiveDate.getFullYear());
  }
  endYear += 5;
    
  for(var year = startYear; year <= endYear; year++) {
    var salary = 0;
    salary = getSalaryForYear(getRelevantRaises(raises, year), year);
    salaries.push({x: new Date(year, 0, 1), y: salary*1});
  }
  console.log(salaries);
  return salaries;                 
}

function getSalaryForYear(relevantRaises, year) {
  var stuff = [];
  var salary = 0;
  var lastRaise = relevantRaises[relevantRaises.length - 1].effectiveDate;
  if (lastRaise.getFullYear() < year) {
    return relevantRaises[relevantRaises.length - 1].salary
  }
  var currDate = new Date(year, 0, 1);
  stuff.push(currDate);
  var firstDate = relevantRaises[0].effectiveDate;
  // nothing before this one
  if (firstDate.getFullYear() === year) {
    currDate = firstDate;
  }
  for (var i = 0; i < relevantRaises.length - 1; i++) {
    var curr = relevantRaises[i];
    var next = relevantRaises[i+1];
    var nextDate = next.effectiveDate;
    var diffTime = Math.abs(currDate.getTime() - nextDate.getTime());
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var diffFrac = diffDays / 365.0;
    salary += diffFrac * curr.salary
    currDate = nextDate;
  }
  
  nextDate = new Date(year + 1, 0);
  diffTime = Math.abs(lastRaise.getTime() - nextDate.getTime());
  diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  diffFrac = diffDays / 365.0;
  salary += diffFrac * relevantRaises[relevantRaises.length - 1].salary;
  return salary;
}

function getRelevantRaises(raises, year) {
  var relevantRaises = [];
  for (var i = raises.length-1; i >= 0; i--) {
    var raiseYear = raises[i].effectiveDate.getFullYear();
    if (raiseYear === year) {
      relevantRaises.unshift(raises[i]);
    } else if (raiseYear === year - 1) {
      relevantRaises.unshift(raises[i]);
      break;
    }
  }
  if (relevantRaises.length === 0) {
    relevantRaises.unshift(raises[raises.length - 1]);
  }
  return relevantRaises;
}

export default getBaseSalaryPerYear;
