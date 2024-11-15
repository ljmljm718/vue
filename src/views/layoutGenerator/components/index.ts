import LyCardFrame from './cardItem.vue';
import LyTable from './layoutTable.vue';
import LyChart from './layoutChart.vue';

const componentsMap = new Map([
  ['LyCardItem', LyCardFrame],
  ['LyTable', LyTable],
  ['LyChart', LyChart]
]);

export default componentsMap;
