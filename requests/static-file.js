
const Emitter = require('events');
const fs = require('fs');

class StaticFile extends Emitter {
    constructor (
        {
            response,
            useWindowsPath = false,
            pathArray = [],
            rootPath = []
        }
    ) 
    
    {
        super();
        
        this.response = response;
        this.useWindowsPath = useWindowsPath;
        this.fullPath = rootPath.push(...pathArray);
        this.send();
    }
    
    _send (err, data) {
        if (err) {
            this.response.writeHead(404);
            console.log(err);
            return this.response.end('404 - resource not found');
        }

        this.responses.writeHead(200);
        this.response.end(data);
    }
        
    send () {
        var filePath = this.convertToPath(this.fullPath);
        console.log(filePath);
        fs.readFile(filePath, this._send.bind(this));
    }
    
    convertToPath(pathList = []) {
        return pathList.join(this.useWindowsPath ? '\\' : '/');
    }    
}

module.exports = StaticFile;