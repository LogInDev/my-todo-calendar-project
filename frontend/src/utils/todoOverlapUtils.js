import dayjs from 'dayjs'

export function groupOverlappingTodos(todos) {
  const groups = []

  todos
    .sort((a, b) => new Date(a.startDatetime) - new Date(b.startDatetime))
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
  return start1.isBefore(end2) && start2.isBefore(end1)
}
