import { generateUUID } from "@/utils"
const document = [
  {
    id: generateUUID(),
    content: '明月村',
    meta: {
      address: "重庆市涪陵区",
      lonlat: "107.039584,29.467733",
      name: "明月村"
    }
  },
  {
    id:generateUUID(),
    content:'双桥村',
    meta:{
      address:"重庆市酉阳县",
      lonlat:"108.695672,28.6984455",
      name:"双桥村"
    }
  },
  {
    id:generateUUID(),
    content:'梧桐村',
    meta:{
      address:"重庆市万州区",
      lonlat:"108.703826,30.6362342",
      name:"梧桐村"
    }
  },
]

export const searchDoc = (query:string) => {
  return document.filter(item => {
    const queryArr = query.split(" ");
    const existMatchDoc = queryArr.find(_query => {
      return item.content.indexOf(_query) !== -1
    })
    return !!existMatchDoc;
  })
}

