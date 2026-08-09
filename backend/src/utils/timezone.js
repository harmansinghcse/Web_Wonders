const APP_TIMEZONE = process.env.APP_TIMEZONE || "UTC";

/**
 * Returns the current date formatted as YYYY-MM-DD in the configured APP_TIMEZONE.
 * @param {Date} [date] - Optional date to format, defaults to now.
 * @returns {string} - YYYY-MM-DD
 */
function getTodayDateString(date = new Date()) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: APP_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === "year").value;
    const month = parts.find(p => p.type === "month").value;
    const day = parts.find(p => p.type === "day").value;
    return `${year}-${month}-${day}`;
}

/**
 * Returns the Date object representing the next reset time (midnight of the next calendar day in APP_TIMEZONE).
 * @param {Date} [date] - Optional current date, defaults to now.
 * @returns {Date}
 */
function getNextResetTime(date = new Date()) {
    const todayStr = getTodayDateString(date);
    const [year, month, day] = todayStr.split("-").map(Number);
    
    // We want the start of tomorrow (00:00:00) in APP_TIMEZONE.
    // We can find the epoch time of that moment by constructing it.
    // One robust way is to construct a UTC date and then adjust by timezone offset.
    // Or we can start from now and increment the date until the date string changes, 
    // or calculate the offset at tomorrow midnight.
    // Let's do a reliable calculation:
    // Create tomorrow's date at 00:00:00 local time, then adjust.
    // A clean approach:
    // 1. Create a date object at UTC tomorrow midnight:
    const tomorrowUTC = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));
    
    // 2. Determine offset in milliseconds between UTC and APP_TIMEZONE at tomorrowUTC
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: APP_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    
    // Formatted tomorrowUTC in APP_TIMEZONE
    const parts = formatter.formatToParts(tomorrowUTC);
    const tzYear = parseInt(parts.find(p => p.type === "year").value);
    const tzMonth = parseInt(parts.find(p => p.type === "month").value);
    const tzDay = parseInt(parts.find(p => p.type === "day").value);
    const tzHour = parseInt(parts.find(p => p.type === "hour").value);
    const tzMin = parseInt(parts.find(p => p.type === "minute").value);
    const tzSec = parseInt(parts.find(p => p.type === "second").value);

    const tzDate = new Date(Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMin, tzSec));
    const offsetMs = tomorrowUTC.getTime() - tzDate.getTime();
    
    // The exact epoch time when APP_TIMEZONE reaches tomorrow midnight is:
    return new Date(tomorrowUTC.getTime() + offsetMs);
}

module.exports = {
    getTodayDateString,
    getNextResetTime,
    APP_TIMEZONE,
};
