function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

const log = debounce((msg: string) => console.log(msg), 300)
log('a')  // cancelled by next call
log('b')  // cancelled by next call
log('c')  // only this one fires after 300ms → "c"