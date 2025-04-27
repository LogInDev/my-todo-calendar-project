import dayjs from 'dayjs'

export function groupOverlappingTodos(todos) {
  const groups = []

  todos
    .sort((a, b) => dayjs(a.startDatetime).valueOf() - dayjs(b.startDatetime).valueOf()) 
    .forEach(todo => {
      const overlappingGroup = groups.find(group =>
        group.some(t => isOverlap(t, todo))
      )

      if (overlappingGroup) {
        overlappingGroup.push(todo)
      } else {
        groups.push([todo])
      }
    })

  return groups
}

export function isOverlap(todo1, todo2) {
  const start1 = dayjs(todo1.startDatetime)
  const end1 = dayjs(todo1.endDatetime)
  const start2 = dayjs(todo2.startDatetime)
  const end2 = dayjs(todo2.endDatetime)
  // 종일인 경우
  if (todo1.isAllDay && todo2.isAllDay) {
    return (
      start1.startOf('day').isBefore(end2.endOf('day')) &&
      start2.startOf('day').isBefore(end1.endOf('day'))
    );
  }

  // 시간이 같은 경우
  if (start1.isSame(end1) && start2.isSame(end2)) {
    return start1.isSame(start2);
  }

  return start1.isBefore(end2) && start2.isBefore(end1)
}
