import { generateUUID } from "@/utils"
const document = [
  {
    id: generateUUID(),
    content: '明月寺',
    meta: {
      address: "四川省宜宾市叙州区",
      lonlat: "104.163974,29.055893",
      name: "明月寺"
    }
  },
  {
    id: generateUUID(),
    content: '明月村',
    meta: {
      address: "四川省宜宾市叙州区",
      lonlat: "104.163974,29.055893",
      name: "明月村"
    }
  }
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

