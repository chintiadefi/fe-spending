import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

dayjs.locale("id");

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.tz.setDefault("Asia/Jakarta");

dayjs.updateLocale("en", {
  weekdaysMin: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  weekdays: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  months: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
});

export const FORMAT_DATE = "DD MMMM YYYY, HH:mm";

const IndonesiaTimezones = {
  7: "Asia/Jakarta",
  8: "Asia/Makassar",
  9: "Asia/Manokwari",
};

export const getCurrentTimeZone = () => {
  const offset = dayjs().utcOffset() / 60;
  return IndonesiaTimezones[offset] || dayjs.tz.guess();
};

export default dayjs;
