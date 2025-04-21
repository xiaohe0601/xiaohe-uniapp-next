import { alova } from "@/service/core";

export function alovaGetExample(params: Record<string, any>) {
  return alova.Get<string>("/example", { params });
}