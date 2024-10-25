const list = import.meta.glob("./*.png", { eager: true });
export const ImageList = Object.values(list).map((v: any) => v.default);