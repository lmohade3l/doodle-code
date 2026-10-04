// function flatten (arr){
//     let res = [];
//     arr?.forEach(element => {
//         if(Array.isArray(element)) {
//             res.push(...element)
//         } else {
//             res.push(element)
//         }
//     });

//     return res
// }

//reduce
function flatten(arr) {
    return arr.reduce((acc, cur) => {
        if (Array.isArray(cur)) {
            return [...acc, ...cur]
        } else {
            return [...acc, cur]
        }
    }, [])
}


// console.log(flatten([1, [2, 3], [4, 5]]))


function deepFlatten(arr) {
    return arr.reduce((acc, cur) => {
        if (Array.isArray(cur)) {
            acc.push(...deepFlatten(cur))
        } else acc.push(cur)

        return acc
    }, [])
}

console.log(deepFlatten([1, [2, [3, ['sara'], 4]], 5]))