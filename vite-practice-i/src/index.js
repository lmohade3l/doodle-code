console.log('hello from index.html')

import temp from './temp'
temp()

document.getElementById('click-btn').addEventListener('click', async () => {
    const  temp  = await import('./temp')

    temp()
})