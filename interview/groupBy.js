function groupBy(arr , key) {
    const res = {}

    arr.forEach((element , index) => {
        if(res[element[key]]) {
            res[element[key]].push(element)
        } else {
            res[element[key]] = []
            res[element[key]].push(element)
        }
    });

    return res
}

const users = [
  { name: "Ali", role: "admin" },
  { name: "Sara", role: "user" },
  { name: "Reza", role: "admin" }
];

console.log(groupBy(users, "role"))