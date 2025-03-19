import VConsole from "vconsole";

if (import.meta.env.VITE_ENABLE_VCONSOLE === "true") {
  // eslint-disable-next-line no-new
  new VConsole();
}