const digit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
const transDigit = [
  '',
  'หนึ่ง',
  'สอง',
  'สาม',
  'สี่',
  'ห้า',
  'หก',
  'เจ็ด',
  'แปด',
  'เก้า'
]
const numberText = {
  0: 'ศูนย์',
  1: 'หนึ่ง',
  2: 'สอง',
  3: 'สาม',
  4: 'สี่',
  5: 'ห้า',
  6: 'หก',
  7: 'เจ็ด',
  8: 'แปด',
  9: 'เก้า'
}

function reverseString (str) {
  const splitString = str.split('')
  const reverseArray = splitString.reverse()
  const joinArray = reverseArray.join('')
  return joinArray
}

function satang (str) {
  const arrSatang = str.split('')
  const total = arrSatang.reduce((sum, item) => {
    return sum + numberText[item]
  }, '')
  return total
}

export default (number) => {
  const newNum = number.toString()
  const split = newNum.split('.')
  let s = ''

  if (number !== '') {
    number = parseInt(number)
    number = number.toString()
  }

  const t = reverseString(number)
  number = t.match(/.{1,6}/g)

  for (let i = 0; i < number.length; i++) {
    const temp = number[i]
    if (s !== '') {
      s = 'ล้าน' + s
    }
    if (number[i].length === 1) {
      s = (temp[0] === '0' ? 'ศูนย์' : '') + s
      s = (temp[0] === '1' ? 'หนึ่ง' : '') + s
      s = (temp[0] !== '0' && temp[0] !== '1' ? transDigit[temp[0]] : '') + s
    } else {
      for (let j = 0; j < 6; j++) {
        if (j === 0) {
          s = (temp[0] === '1' ? 'เอ็ด' : transDigit[temp[0]]) + s
        }
        if (j === 1) {
          s =
            (temp[1] === '1'
              ? ''
              : temp[1] === '2'
                ? 'ยี่'
                : transDigit[temp[1]]) +
            digit[temp[1] !== '0' ? 1 : 0] +
            s
        }
        if (j !== 0 && j !== 1) {
          s =
            (temp[j] !== undefined
              ? transDigit[temp[j]] + digit[temp[j] !== '0' ? j : 0]
              : '') + s
        }
      }
    }
  }

  if (split[1] !== undefined) {
    const textSatang = satang(split[1])
    return s + 'จุด' + textSatang + 'บาท'
  } else {
    return s + 'บาท'
  }
}
