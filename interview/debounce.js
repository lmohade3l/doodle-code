const debounced = (fn, delay) => {
    let timer;

    return function (...args) {
        clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

const func = (name) => {
    console.log('hey!' + name)
}

const debouncedFunc = debounced(func , 100)

debouncedFunc('sara')
debouncedFunc('ali')
debouncedFunc('ali 2')
debouncedFunc('ali 3')
debouncedFunc('saraaaa')


// صبر میکنم اگر از اخرین کال این تابع به اندازه دیلی گذشت اجراش میکنم!
function debounce(fn , delay) {
    let timer;

    return function(...args) {
        clearTimeout(timer)

        return fn.apply(this , args)
    }
}



// THROTTLE
function throttle(fn , delay) {
    let last = 0;

    return function(...args) {
        const now = Date.now()

        if(now - last >= delay) {
            last = now
            fn.apply(this , args)
        }
    }
}