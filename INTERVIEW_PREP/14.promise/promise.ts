// @ts-nocheck

class MyPromise {
    constructor(executor) {
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = () => {}
        const reject = () => {}

        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }
}