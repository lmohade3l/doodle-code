// @ts-nocheck

class MyPromise {
    constructor(executor) {
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value: any) => {
            // because the promise gets resolved only once!
            if (this.status !== 'pending') return

            // if is still pending and has not been resolved yet:
            this.value = value
            this.status = 'fulfilled'
            this.reason = undefined
            queueMicrotask(() => {
                this.onFulfilledCallbacks.forEach(element => {
                    element(this.value)
                })
            })
        }

        const reject = (err) => {
            if (this.status !== 'pending') return

            this.status = 'rejected'
            this.value = undefined
            this.reason = err
            queueMicrotask(() => {
                this.onRejectedCallbacks.forEach(element => {
                    element(this.reason)
                })
            })
        }

        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
        
    }
}