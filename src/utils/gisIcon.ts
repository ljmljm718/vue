const iconMap = new Map([
  ['土壤', '3'],
  ['气象', '1'],
  ['虫', '4'],
  ['水质', '5'],
  ['生长', '6'],
  ['视频', '2']
]);

export const iconMapArr = Array.from(iconMap.keys());
export const textMatchInIconMap = (text: string) => {
  return iconMapArr.find((item) => text.indexOf(item) !== -1);
};

export const GIS_ICON_BASE_URL = `/images/mapIcon/`;

export const getIconByName = (name: string) => {
  let matchStr = '1';
  iconMap.forEach((value, key) => {
    if (name.indexOf(key) !== -1) {
      matchStr = value;
    }
  });
  if (!matchStr) console.error(`未匹配的name => ${name}`);
  return matchStr;
};

export const formatIconPath = (name: string, online = false) => {
  return `${GIS_ICON_BASE_URL}icon${getIconByName(name)}${online ? '' : '_off'}.png`;
};

export const formatIconClass = (name: string, online = false) => {
  return `gis-map-icon${online ? '' : '-off'}-${getIconByName(name)}`;
};
