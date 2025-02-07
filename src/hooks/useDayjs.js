import { useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Hỗ trợ tiếng Việt

// Cấu hình mặc định là tiếng Việt
dayjs.locale("vi");

const useDayjs = () => {
  // Định dạng ngày giờ theo template
  const formatDate = useCallback((date, format = "YYYY-MM-DD HH:mm:ss") => {
    return dayjs(date).format(format);
  }, []);

  // Thêm thời gian (days, months, hours,...)
  const addTime = useCallback((date, value, unit) => {
    return dayjs(date).add(value, unit).format("YYYY-MM-DD HH:mm:ss");
  }, []);

  // Trừ thời gian
  const subtractTime = useCallback((date, value, unit) => {
    return dayjs(date).subtract(value, unit).format("YYYY-MM-DD HH:mm:ss");
  }, []);

  // Chuyển đổi timestamp sang ngày
  const fromTimestamp = useCallback((timestamp, format = "YYYY-MM-DD HH:mm:ss") => {
    return dayjs.unix(timestamp).format(format);
  }, []);

  // Chuyển ngày sang timestamp
  const toTimestamp = useCallback((date) => {
    return dayjs(date).unix();
  }, []);

  // So sánh ngày
  const isBefore = useCallback((date1, date2) => {
    return dayjs(date1).isBefore(dayjs(date2));
  }, []);

  const isAfter = useCallback((date1, date2) => {
    return dayjs(date1).isAfter(dayjs(date2));
  }, []);

  const isSame = useCallback((date1, date2, unit = "day") => {
    return dayjs(date1).isSame(dayjs(date2), unit);
  }, []);

  // Tính khoảng cách giữa 2 ngày
  const diff = useCallback((date1, date2, unit = "day") => {
    return dayjs(date2).diff(dayjs(date1), unit);
  }, []);

  return {
    formatDate,
    addTime,
    subtractTime,
    fromTimestamp,
    toTimestamp,
    isBefore,
    isAfter,
    isSame,
    diff,
  };
};

export default useDayjs;
