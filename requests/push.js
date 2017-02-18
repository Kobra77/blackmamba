
const EventEmitter = require('events');

class Push extends EventEmitter {
    constructor (
        {
            response = {},
            request = {},
            url,
            mambaRequest,
            token,            
        }
    ) 
    {
        super();
        
        this.res = response;
        this.req = request;
        
        this.res.writeHead(
            200, 
            {
                "Content-Type":"text/event-stream", 
                "Cache-Control":"no-cache", 
                "Connection":"keep-alive"
            }
        )
        
        this.req.connection.addListener("close", this.close.bind(this), false);        
        
    }
    
    send (message) {
        this.res.write(message);
    }
    
    close () {
        this.res.end();
        this.emit('connection-closed', this);
    }
} 


class PushStore extends EventEmitter {
    constructor () {
        super();    
        this.items = [];
    }
    
    handle (params) {
        var push = new Push(params);
        
        push.on('connection-closed', this.remove.bind(this, push));
        this.items.push(push); 
    }
    
    remove (push) {
        var index = this.items.indexOf(push);
        this.items.splice(index, push);
    }
    
    message (message) {
        for (let item of this.items) {
            item.send(message);
        }
    }
    
}

var Store = new PushStore();

module.exports = function () { return Store; };