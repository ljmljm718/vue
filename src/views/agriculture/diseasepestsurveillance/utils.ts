export const throttle = (func: any, delay: number) => {
  let last: number;
  return (args: any) => {
    const now = + (new Date());
    if (!last || (now - last) >= delay) {
      last = now;
      func(args);
    }
  };
}