const timeToFallAsleep = 15;
const cycle = 90;
const minInHour = 60;
const hourBase = 12;

export function getGreeting(today) {
  const curHr = today.hour();
  let greet = "";
  if (curHr < 12) {
    greet = "Good morning! ";
  } else if (curHr < 18) {
    greet = "Good afternoon! ";
  } else {
    greet = "Good evening! ";
  }

  return greet;
}

export function checkGetUpTime(date) {
  let hours = date.hour();
  const min = date.minute();
  let dayHalf;

  if (hours / hourBase > 1) {
    dayHalf = "PM";
    hours = hours % hourBase;
  } else {
    dayHalf = "AM";
  }

  let startTimeArr = calculateTime(hours, min, dayHalf, timeToFallAsleep);
  const wakeUpTime = [];
  const MAX_RANGES = 7;
  for (let timeRangeCount = 0; timeRangeCount < MAX_RANGES; timeRangeCount++) {
    startTimeArr = calculateTime(
      startTimeArr.hours,
      parseInt(startTimeArr.min),
      startTimeArr.dayHalf,
      cycle
    );
    if (startTimeArr.min < 10) {
      startTimeArr.min = "0" + startTimeArr.min;
    }
    wakeUpTime.push(
      startTimeArr.hours + ":" + startTimeArr.min + " " + startTimeArr.dayHalf
    );
  }
  return wakeUpTime;
}

function calculateTime(hours, min, dayHalf, change) {
  const maxValue = minInHour * hourBase;
  let timeInMin;
  let newH;

  let _hours = hours;
  let _min = min;
  let _dayHalf = dayHalf;

  if (_hours === hourBase) {
    timeInMin = _min;
    _hours = 0;
  } else {
    timeInMin = _hours * minInHour + _min;
  }

  const newTime = timeInMin + change;

  if (newTime >= 0) {
    _min = newTime % minInHour;
    if (Math.floor(newTime / minInHour) >= hourBase) {
      newH = Math.floor(newTime / minInHour) - hourBase;
    } else {
      newH = Math.floor(newTime / minInHour);
    }
  } else {
    _min = minInHour + (newTime % minInHour);
    newH = Math.floor((maxValue + (timeInMin + change)) / minInHour);
  }

  if ((change > 0 && newH < _hours) || (change < 0 && newH > _hours)) {
    if (_dayHalf === "AM") {
      _dayHalf = "PM";
    } else {
      _dayHalf = "AM";
    }
  }

  if (newH === 0) {
    _hours = hourBase;
  } else {
    _hours = newH;
  }
  return { hours: _hours, min: _min, dayHalf: _dayHalf };
}
