// 랜덤 색상 생성 함수
export const getRandomColor = () => {
  const colors = [
    '#FFB6C1', '#FFD700', '#7FFFD4',
    '#87CEFA', '#DDA0DD', '#90EE90', '#FFA07A'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
