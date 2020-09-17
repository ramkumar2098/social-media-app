export function month(fullDate) {
  const month = new Date(fullDate).getMonth()

  switch (month) {
    case 0:
      return 'Jan'
    case 1:
      return 'Feb'
    case 2:
      return 'Mar'
    case 3:
      return 'Apr'
    case 4:
      return 'May'
    case 5:
      return 'June'
    case 6:
      return 'July'
    case 7:
      return 'Aug'
    case 8:
      return 'Sept'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
    default:
      throw 'Invalid date'
  }
}

export function date(fullDate) {
  return new Date(fullDate).getDate()
}

export function year(fullDate) {
  return new Date(fullDate).getFullYear()
}
