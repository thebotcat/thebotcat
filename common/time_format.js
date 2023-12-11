// converts a time in milliseconds to M:SS.LLL or H:MM:SS.LLL
function msecToHMS(ms) {
  if (typeof ms != 'number' || ms < 0 || ms > 1e33) return '-:--.---';
  if (ms < 3600000)
    return `${Math.floor(ms / 60000)}:${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}.${('' + Math.floor(ms) % 1000).padStart(3, '0')}`;
  else
    return `${Math.floor(ms / 3600000)}:${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}:${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}.${('' + Math.floor(ms) % 1000).padStart(3, '0')}`;
}

// converts a time in milliseconds to h m s ms
function msecToHMSs(ms) {
  if (ms < 3600000)
    return `${Math.floor(ms / 60000)}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
  else if (ms < 86400000)
    return `${Math.floor(ms / 3600000)}h ${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
  else
    return `${Math.floor(ms / 86400000)}d ${('' + Math.floor(ms / 3600000) % 24).padStart(2, '0')}h ${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
}

// converts a time string in XXd XXh XXm XXs XXXms or [[[d:]hh:]mm:]ss[.mmm] format to just milliseconds
function timeStringToMs(timeString) {
  if (timeString.length == 0) {
    return null;
  }
  
  if (timeString[0] == '-' && timeString[1] == '-') {
    return null;
  }
  
  if (timeString[0] == '-') {
    return timeStringToMs(timeString.slice(1));
  }
  
  let match;
  
  match = /(?:(\d+)d)? ?(?:(\d+)h)? ?(?:(\d+)m)? ?(?:(\d+)s)? ?(?:(\d+)ms)?/.exec(timeString);
  
  if (match) {
    if (match[1] || match[2] || match[3] || match[4] || match[5]) {
      return (match[1] ? parseInt(match[1]) : 0) * 24 * 3600 * 1000 +
             (match[2] ? parseInt(match[2]) : 0) * 3600 * 1000 +
             (match[3] ? parseInt(match[3]) : 0) * 60 * 1000 +
             (match[4] ? parseInt(match[4]) : 0) * 1000 +
             (match[5] ? parseInt(match[5]) : 0);
    }
  }
  
  match = /(?:(?:(?:(\d+):)?(\d+):)?(\d+):)?(\d+)(?:\.(\d+))?/.exec(timeString);
  
  if (match) {
    return (match[1] ? parseInt(match[1]) : 0) * 24 * 3600 * 1000 +
           (match[2] ? parseInt(match[2]) : 0) * 3600 * 1000 +
           (match[3] ? parseInt(match[3]) : 0) * 60 * 1000 +
           (parseInt(match[4])               ) * 1000 +
           (match[5] ? parseInt(match[5]) : 0);
  }
  
  return null;
}

// converts a date object to Day Mon MM YYYY HH:MM:SS UTC format
fancyDateStringWD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
fancyDateStringMD = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fancyDateString(date) {
  return `${fancyDateStringWD[date.getDay()]} ${fancyDateStringMD[date.getMonth()]} ${(''+date.getDate()).padStart(2, '0')} ${date.getFullYear()} ${(''+date.getHours()).padStart(2, '0')}:${(''+date.getMinutes()).padStart(2, '0')}:${(''+date.getSeconds()).padStart(2, '0')}.${(''+date.getMilliseconds()).padStart(3, '0')} UTC`;
}

function IdToDate(id) {
  return new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(id) >> 22n));
}

function dateToId(date) {
  return ((date.getTime() - new Date('2015-01-01T00:00:00.000Z').getTime()) << 22n).toString();
}

module.exports = { msecToHMS, msecToHMSs, timeStringToMs, fancyDateStringWD, fancyDateStringMD, fancyDateString, IdToDate, dateToId };
