a date-range date picker lets up pick a time frame between a start and end date

the "n of selector" syntax
:nth-child selector filters elements by a given selector first among all the child elements, before selecting them by a counting order

.x-class: nth-child(2) => find an .x-class element that is the second child of it's parent
:nth-child(2 of .x-class) => look for the second element among the .x-class elements

** implementation notes **
- find the date-element that has been selected:
    const CAL = document.querySelector('.calender')
    CAL.addEventListener('click' , (e) => {
        const date = e.target.closest('.date')
    })


- when three dates are selected, we need to decide which one to remove. for that we need to find the indexes for clicked date-element and also the other selected date-elements.
    const firstSelectedElement = CAL.querySelector(':nth-child(1 of .date.selected)')
    const firstIndex = Array.from(CAL.querySelectorAll('.date')).indexOf(firstSelectedElement)

    we find second and third selected dates like above

    const clickedIndex = Array.from(CAL.querySelectorAll('.date')).indexOf(date)

    if(clickedIndex === firstIndex) {
        secondSelectedElement.classList.remove('.selected')
    }
    if(clickedIndex === secondIndex) {
        thirdSelectedElement.classList.remove('.selected')
    }
    if(clickedIndex === thirdIndex) {
        secondSelectedElement.classList.remove('.selected')
    }
