

const EventEmitter = require('events');
const http = require("http");
const url = require('url');
const fs = require('fs');

class Blackmamba extends EventEmitter {
    constructor (config) {
        super();
        this.server = http.createServer(this.requestHandler.bind(this));
        this.config = config;
        
        // makes Blackmamba available for window and unix
        this.useWindowsPath = this.detectWindowsFilePath();
        
        var port = config.port;
        
        this.server.listen(port, (err) => {
            err ? console.log(err) 
                : console.log(`Server connected listening on port ${this.config.port}`);
        });
        
        this.on('admin', this.admin.bind(this));
        this.on('api', this.api.bind(this));
    }
    
    requestHandler (req, res) {
        var reqUrl = url.parse(req.url, true, true);
        var safeURl = this.safeUrl(req.url);
        
        if (!safeURl) return this.error(404, res, req.url);
        
        var decoded = this.analyzeUrl(reqUrl);
        var feature = decoded.feature;
        var proto = decoded.proto;
        var token = req.headers['x-access-token'];
        var options = {
            request: req,
            response: res,
            url: reqUrl,
            feature: feature,
            token: token
        };
        var self = this;
        var rawPath;
        
        switch (decoded.requestType) {
            case 'admin':
                this.emit('admin', options);
                break;
                
            case 'api':
                this.emit('api', options);
                break;
                
            case 'prototype':
                let protoRequireLogin = this.prototypes[proto].requireLogin;
                rawPath = !token && protoRequireLogin ?
                    [__dirname, 'client', 'login', 'index.html'] :
                    [__dirname, 'prototypes', proto, 'index.html'];
                    sendStaticFile(rawPath);                
                break;
                
            case 'js' || 'css':
                rawPath = [__dirname, 'client'];
                
                if (feature) rawPath = [__dirname, 'features', feature, 'client'];
                if (proto) rawPath = [__dirname, 'prototypes', proto, 'client'];

                rawPath.push(...decoded.subPath); 
                
                sendStaticFile(rawPath);
                break;
                
            case 'index.html':
                if (this.config.server.homePageLogin) {
                    rawPath = token ?
                        [__dirname, 'client', 'index.html']:
                        [__dirname, 'client', 'login', 'index.html'];
                } else {
                    rawPath = [__dirname, 'client', 'index.html'];
                }
                sendStaticFile(rawPath);
                break;
            default:
                this.error(404, res, 'Error 404 resource not found or invalid');
                
        }
        
        function staticFile (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('error loading static file');
            }
    
            res.writeHead(200);
            res.end(data);
        }
        
        function sendStaticFile (pathArray) {
            var filePath = self.convertToPath(pathArray);
            console.log(filePath);
            fs.readFile(filePath, staticFile);
        }        
        
    }

    analyzeUrl (urlObj) {
        /*
            url patern:
    
                /<rootpath>/<feature>      -> render the app with the given feature
                /<rootpath>/<feature>/<myJavascriptFile>.js  -> goto feature client folder
                /<rootpath>/<feature>/<myCSSFile>.css        -> goto feature client folder
                /<rootpath>/admin/<feature>                  -> got to feature admin
                /<rootpath>/api/<feature>  -> rest api
                /<rootpath>/prototype/<prototypeName>
        */
        var path = urlObj.pathname;
        var requestType = 'index.html';
        
        console.log({path: path});
        
        if (path) {
            var rootPath = this.config.server ? this.config.server.root : null;
            var isAdmin = path.startsWith(rootPath ? `/${rootPath}/admin` : '/admin'),
                isAPI = path.startsWith(rootPath ? `/${rootPath}/api` : '/api'),
                isPrototype = path.startsWith(rootPath ? `/${rootPath}/prototype/` : '/prototype/'),
                isJavascript = path.endsWith('.js'),
                isCss = path.endsWith('.css'),
                feature = null, 
                proto = null, 
                list = [];
        
            if (rootPath) path.replace(`/${rootPath}`, '');
        
            if (isAdmin) {
                path.replace('/admin', '');
                requestType = 'admin';
            }
            
            if (isPrototype) {
                path.replace('/prototype', '');
                requestType = 'prototype';
            }
            if (isAPI) {
                path.replace('/api');
                requestType = 'api';
            }
            
            if (isJavascript) requestType = 'js';
            if (isCss) requestType = 'css';
            
        
            list = path.split('/');
            while (list[0] == '') {
                list.shift();
            }
    
            if (isPrototype) proto = list.shift();
            console.log(list);
            if ((isJavascript || isCss) && list.length > 1) feature = list.shift();
            console.log('feature', feature);
        }
        return {
            requestType: requestType,
            feature: feature,
            proto: proto,
            subPath: list
        }
    }
    
    detectWindowsFilePath () {
        return __dirname.includes('\\');
    }
    
    convertToPath(pathList = []) {
        return pathList.join(this.useWindowsPath ? '\\' : '/');
    }
    
    safeUrl (url) {
        return !url.includes('../') || !url.includes('./');
    }
    
    error (code, res, reason) {
        res.writeHead(code);
        res.end(reason);
    }
    
    admin (e) { console.log(e); }
    api (e) { console.log (e); }
    
} 


module.exports = function (config) {
    console.log('creating Blackmamba server instance');
    console.log(`using port ${config.port}`);
    return new Blackmamba(config);
};
