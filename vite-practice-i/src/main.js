console.log('hello from main.js')

// import heavy from './heavy'
// heavy()

document.getElementById('click-btn-a').addEventListener('click', async () => {
    const { default: pageA } = await import('./pageA')
    pageA()
})

document.getElementById('click-btn-b').addEventListener('click', async () => {
    const { default: pageB } = await import('./pageB')
    pageB()
})