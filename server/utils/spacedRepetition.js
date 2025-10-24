// Simple spaced repetition schedule (days). You can tweak it.
const intervals = [1, 7, 30, 90, 180];


function nextRevisionDate(currentCount) {
const idx = Math.min(currentCount, intervals.length - 1);
const days = intervals[idx];
const d = new Date();
d.setDate(d.getDate() + days);
return d;
}


module.exports = { nextRevisionDate };