import dayjs from 'dayjs'

export function groupOverlappingTodos(todos) {
  const groups = []

  todos
    .sort((a, b) => new Date(a.start) - new Date(b.start))
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
  const start1 = dayjs(todo1.start)
  const end1 = dayjs(todo1.end)
  const start2 = dayjs(todo2.start)
  const end2 = dayjs(todo2.end)
  return start1.isBefore(end2) && start2.isBefore(end1)
}
