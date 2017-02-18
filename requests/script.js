
const EventEmitter = require('events');
const StaticFile = require("./static-file.js");
const error = function() {}

class Script extends EventEmitter {
    constructor (extensions) {
        super();
        
        this.extensions = extensions;
    }
    
    handle (
        {
            request,
            response,
            url,
            mambaRequest,
            token,
        }
    ) 
    {
        // check first if extension is supported
        var supported = false;
        
        for (let ext of this.extensions) {
            if (url.pathname.endsWith(ext)) supported = true;
        }
        
        if (!supported) {
            response.writeHead(404);
            return response.end('Bad resource request');
        }
        
        var folder = mambaRequest.feature ? 'features': 'client'
        var root = mambaRequest.root;
        var pathArray = mambaRequest.feature ? 
            [root, folder, mambaRequest.feature, 'client']
                : [root, folder];
                
        pathArray.push(...mambaRequest.subPath);    
        
        return new StaticFile({
           response: response,
           pathArray: pathArray,
           useWindowsPath: mambaRequest.useWindowsPath
        });
    }
    
}

module.exports = function (config) {
    return new Script(config);
}