export function useVueThis() {
  const vm = getCurrentInstance();

  return vm!.proxy!;
}