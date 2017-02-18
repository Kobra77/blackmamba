

const EventEmitter = require('events');
const http = require("http");
const url = require('url');
const fs = require('fs');

class Blackmamba extends EventEmitter {
    constructor (config) {
        super();
        this.server = http.createServer(this.requestHandler.bind(this));
        this.config = config;
        this.api = {};
        this.features = Object.keys(config.features);
        
        // allow Blackmamba to adapt path for window or unix
        this.useWindowsPath = this.detectWindowsFilePath();

        // for each request types an API class handler must be created
        this.generateServerAPIs();
        
        var port = config.server.port;
        
        this.server.listen(port, (err) => {
            err ? console.log(err) 
                : console.log(`Server connected listening on port ${port}`);
        });
    }
    
    generateServerAPIs () {
        var requestTypes = this.config.requestTypes.list;
        
        for (let name of requestTypes) {
            let config = this.requestTypes.config[name];
            let api = this.api[name] = require(`/requests/${name}.js`)(config);
            
            // triggered by this.requestHandler()
            this.on(name, api.handle.bind(api));
        }        
    }
    
    requestHandler (req, res) {
        var reqUrl = url.parse(req.url, true, true);
        var safeURl = this.safeUrl(req.url);
        
        if (!safeURl) return this.error(404, res, req.url);

        var options = {
            request: req,
            response: res,
            url: reqUrl,
            mambaRequest: this.analyzeUrl(reqUrl),
            token: req.headers['x-access-token']
        };
        var requestType = options.mambRequest.requestType;
        
        this.emit(requestType, options);
    }
    
    analyzeUrl (urlObj) {
        /*
            url patern:
                /<rootpath>
                /<rootpath>/<feature>             
                /<rootpath>/<feature>/<requestType>
                /<rootpath>/<feature>/<requestType>/<path>/<to>/<file>.<ext>
        */
        var path = urlObj.pathname;
        var requestType = 'client';
        var feature = this.config.server.homePageLogin ? 'login' : 'home';

        var requestTypes = this.config.requestTypes;
            
        var breakPath, rootPath;    
        
        console.log({path: path});
        
        if (path) {
            rootPath = this.config.server ? this.config.server.root : null;

            if (rootPath) path.replace(`/${rootPath}`, '');
            
            breakPath = path.split('/');
            
            while (breakPath[0] == '') {
                breakPath.shift();
            }
            if (this.features.includes(breakPath[0])) feature = breakPath.shift();            
            if (requestTypes.includes(breakPath[0])) requestType = breakPath.shift();
        }
        return {
            requestType: requestType,
            feature: feature,
            subPath: breakPath,
            root: __dirname,
            useWindowsPath: this.useWindowsPath
        }
    }
    
    detectWindowsFilePath () {
        return __dirname.includes('\\');
    }
    
    convertToPath(pathList = []) {
        return pathList.join(this.useWindowsPath ? '\\' : '/');
    }
    
    safeUrl (url) {
        // to be extended with other url safe check methods
        return !url.includes('../') 
            || !url.includes('./') 
            || !url.includes('\\');
    }
    
    error (code, res, reason) {
        res.writeHead(code);
        res.end(reason);
    }
} 


module.exports = function (config) {
    console.log('creating Blackmamba server instance');
    console.log(`using port ${config.port}`);
    return new Blackmamba(config);
};
