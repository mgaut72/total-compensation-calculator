const alphavantagekey = 'UK51DXH627CUGM2W';

async function getPrice(ticker) {
  /*
  const resp = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphavantagekey}`).then(r => r.json());
  console.log(resp);
  return resp["Global Quote"]["05. price"];
  */
  return 48.85
}

async function getGrantVestValueByYear(grant, vestingSchedule) {
  const vests = await getGrantVests(grant, vestingSchedule);
  let vestValueByYear = [];
  let vestValue = 0;
  let year = 0;
  for (let v of vests) {
    if(v.x.getFullYear() !== year) {
      if (vestValue !== 0 && year !== 0) {
        vestValueByYear.push({x: new Date(year, 0, 1), y: vestValue});
      }
      year = v.x.getFullYear()
      vestValue = 0
    }
    vestValue += v.y
  }
  if (vestValue !== 0) {
    vestValueByYear.push({x: new Date(year, 0, 1), y: vestValue});
  }
  return vestValueByYear;
}


async function getGrantVests(grant, vestingSchedule) {
  const currentPrice = await getPrice(grant.symbol);
  let vests = [];
  let grantDate = grant.grantDate.toDate();
  let accumulated = 0;
  const numVests = vestingSchedule.durationMonths / vestingSchedule.frequencyMonths;
  const vestPercentages = getPercentPerVestList(numVests, vestingSchedule.percentPerVest)
  for(var vestNum = 1; vestNum <= numVests; vestNum++) {
    var vestQuantity = vestPercentages[vestNum-1] * grant.quantity * 0.01;
    var monthNum = vestNum * vestingSchedule.frequencyMonths;
    accumulated += vestQuantity;
    if (accumulated > 0 && monthNum >= vestingSchedule.cliffMonths) {
      var date = new Date(grantDate);
      date.setMonth(grantDate.getMonth() + monthNum);
      if (grant.earlyTerminationDate && date > grant.earlyTerminationDate.toDate()) {
        break;
      }
      vests.push({x: date, y: accumulated * (currentPrice - grant.strikePrice)});
      accumulated = 0;
    }
  }
  return vests;  
}

function getPercentPerVestList(numVests, percentPerVestStr) {
  if (percentPerVestStr === 'EVEN') {
    var percent = 100.0 / numVests;
    var percentList = new Array(numVests);
    for (var i = 0; i < numVests; i++) {
      percentList[i] = percent;
    }
    return percentList;
  }
  else {
    return percentPerVestStr.split(',');
  }
}

export default getGrantVestValueByYear;
