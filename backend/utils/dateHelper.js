/**
 * Utility functions for Monday-to-Sunday week calculations
 */

const getMondayAndSunday = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));

  const dayOfWeek = d.getUTCDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const formatDate = (date) => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dayNum = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${dayNum}`;
  };

  const formatWeekLabel = (mon, sun) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mMonth = months[mon.getUTCMonth()];
    const mDay = mon.getUTCDate();
    const sMonth = months[sun.getUTCMonth()];
    const sDay = sun.getUTCDate();
    const sYear = sun.getUTCFullYear();

    if (mon.getUTCMonth() === sun.getUTCMonth() && mon.getUTCFullYear() === sun.getUTCFullYear()) {
      return `${mDay} - ${sDay} ${mMonth} ${sYear}`;
    }
    return `${mDay} ${mMonth} - ${sDay} ${sMonth} ${sYear}`;
  };

  return {
    weekStart: formatDate(monday),
    weekEnd: formatDate(sunday),
    weekLabel: formatWeekLabel(monday, sunday),
    weekKey: `${formatDate(monday)}_${formatDate(sunday)}`
  };
};

module.exports = {
  getMondayAndSunday
};
