async function getData() {
    try{
        const response = await fetch('/xyz')
        if(response.ok) {
            const data = await response.json()
            return data
        } else {
            throw new Error('errrr')
        }

    } catch(err) {
        console.error('no!')
    }
}