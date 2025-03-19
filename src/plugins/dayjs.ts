import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

dayjs.extend(customParseFormat);