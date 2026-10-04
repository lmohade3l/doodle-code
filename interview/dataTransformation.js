function transformData (arr) {
    return arr.filter(a => a?.active && a.age>= 18).map(a => {
        return {
            id: a?.id,
            fullName: a?.firstName + ' ' + a?.lastName  
        }
    })
}

const users = [
  { id: 1, firstName: "Ali", lastName: "Ahmadi", age: 22, active: true },
  { id: 2, firstName: "Sara", lastName: "Mohammadi", age: 17, active: false },
  { id: 3, firstName: "Reza", lastName: "Karimi", age: 30, active: true }
];

console.log(transformData(users))