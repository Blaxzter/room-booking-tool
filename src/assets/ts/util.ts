// import type { BookableObject } from '@/types'
//
// const pendingChanges = ref<string[]>([])
//
// function calcDiffAndEmitUpdatedValue(unfocus = false) {
//   // calc diff between values and bookableObject
//   const diff = Object.keys(values).reduce<Partial<BookableObject>>((acc, key) => {
//     const typedKey = key as keyof BookableObject
//     const typedValues = values as Partial<BookableObject>
//
//     if (props.bookableObject && typedValues[typedKey] !== props.bookableObject[typedKey]) {
//       // check if typedValues[typedKey] is string -> trim
//       acc[typedKey] = typedValues[typedKey] as any
//     }
//
//     return acc
//   }, {} as Partial<BookableObject>)
//
//   // check if key is in waitOnOnfocus and unfocus is true
//   if (!unfocus) {
//     if (waitOnOnfocus.includes(Object.keys(diff)[0])) {
//       pendingChanges.value = Object.keys(diff)
//       return
//     }
//   }
//
//   if (Object.keys(diff).length === 0) return
//   console.log(diff)
//   // emit the new values to the parent component
//   emit('update', diff)
//   pendingChanges.value = []
// }
//
// // if props bookableObject is passed, create a watcher that calls validate() on change and sets the values to the new bookableObject
// if (props.bookableObject) {
//   const firstRun = ref(true)
//   watch(values, async () => {
//     if (firstRun.value || !props.bookableObject) {
//       firstRun.value = false
//       return
//     }
//     const valid = await validate()
//     console.log(valid)
//     if (!valid.valid) return
//     calcDiffAndEmitUpdatedValue()
//   })
// }
