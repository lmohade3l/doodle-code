function throttle<T extends (...args: any[]) => void>(fn: T , delay: number) {
    let lastCall = 0;

    return function(this: ThisParameterType<T> , ...args: Parameters<T>) {
        if(Date.now() - lastCall > delay) {
            lastCall = Date.now()
            fn.apply(this , args)
        }
    }
}

const myLog = throttle((msg: string) => console.log(msg), 300)
myLog('a')  // fires immediately → "a"
myLog('b')  // ignored (within 300ms)
myLog('c')  // ignored (within 300ms)
setTimeout(() => myLog('d'), 400)  // fires → "d" (300ms passed)