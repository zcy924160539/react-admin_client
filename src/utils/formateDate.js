// 个位数字补零函数
const formate = (time) => time = time < 10 ? '0' + time : time

// 向外暴露时间格式化函数
export default function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  const timeArr = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
  const [year, month, day, hours, minutes, seconds] = timeArr.map(time => formate(time))
  // 返回一个格式为 YYYY-MM-DD hh-mm-ss 的时间字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}Y