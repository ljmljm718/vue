export default class EventBus {
    private eventsMap:Map<string, Array<any>> = new Map()
    emit(eventName, data) {
        const _eventArr = this.eventsMap.get(eventName)
        if (_eventArr) {
            _eventArr.forEach((fn) => fn(data));
        }
    }
    on(eventName, fn) {
        const _eventArr = this.eventsMap.get(eventName) || []
        _eventArr.push(fn)
        this.eventsMap.set(eventName, _eventArr)
    }

    off(eventName, fn) {
        const _eventArr = this.eventsMap.get(eventName)
        if (_eventArr) {
            this.eventsMap.set(eventName, _eventArr.filter(item => item !== fn))
        }
    }
}

export const mainEventBus = new EventBus()