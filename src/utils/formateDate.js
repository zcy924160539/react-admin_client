// 时间格式化函数
export default function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  // 个位数字补零函数
  const formate = (time) => time = time < 10 ? '0' + time : time

  month = formate(month)
  day = formate(day)
  hours = formate(hours)
  minutes = formate(minutes)
  seconds = formate(seconds)
  // 返回一个格式为 YYYY-MM-DD hh-mm-ss 的时间字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}