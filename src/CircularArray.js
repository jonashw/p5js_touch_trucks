function CircularArray(_items){
    let _index = 0;
    this.count = _items.length;
    this.onPrev = new Observable();
    this.onNext = new Observable();
    this.getCurrent = () => _items[_index];
    this.getCurrentIndex = () => _index;
    this.moveNext = () => {
        _index += 1;
        if (_index >= _items.length)
        {
            _index -= _items.length;
        }
        this.onNext.notify();
    }
    this.movePrev = () => {
        _index -= 1;
        if (_index < 0)
        {
            _index = _items.length - 1;
        }
        this.onPrev.notify();
    }

    function Observable(){
        var observers = [];
        this.notify = () => {
            for(var i=0; i<observers.length; i++){
                observers[i]();
            }
        };
        this.subscribe = o => {
            observers.push(o);
        };
    }
}