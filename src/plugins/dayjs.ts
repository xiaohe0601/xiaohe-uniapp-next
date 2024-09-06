import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

dayjs.extend(customParseFormat);
dayjs.extend(weekday);