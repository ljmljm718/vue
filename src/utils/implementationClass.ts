// 将枚举转换为键值对的对象，方便在模板中遍历
export const getImplementationClass = computed(() => {
  return Object.keys(IMPLEMENTATION_CLASS).reduce(
    (acc, key) => {
      if (isNaN(Number(key))) {
        // 排除数字索引（TypeScript 枚举会自动生成数值索引）
        acc[key] = IMPLEMENTATION_CLASS[key as keyof typeof IMPLEMENTATION_CLASS];
      }
      return acc;
    },
    {} as Record<string, string>
  );
});

//实现类
export enum IMPLEMENTATION_CLASS {
  DEFAULT_CLASS = 'cn.iocoder.yudao.module.agriculture.framework.model.handler.SensorDataHandler'
}
