import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isToday = require("dayjs/plugin/isToday");
const isTomorrow = require("dayjs/plugin/isTomorrow");
const isYesterday = require("dayjs/plugin/isYesterday");

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

export default dayjs as any;
