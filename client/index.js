module.exports = function ({
    title = 'Blackmamba',
    mobileWeb = false,
    encoding = 'UTF-8',
    description = '',
    author = '',
    keywords = '',
    domain = '',
    content = '',
    workerManager = ''
}) 
{
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${title}</title>
                
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
                <meta charset="${encoding}">
                <meta name="description" content="${description}">
                <meta name="author" content="${author}">
                <meta name="keywords" content="${keywords}" >
                <link rel="canonical" href="https://${domain}">
                  
                // todo: take count of Open Graph, Twitter Cards and Google Schema.org
                // should be setup in admin client
                
                <style>
                    body {
                        font-family: sans-serif;
                        margin:0;
                        padding:0;
                    }
                </style>
                <script type="text/javascript">
                    var WORKER_MANAGER = new Worker(${workerManager});
                </script>        
            </head>
            <body>
                ${content}
            </body>
        </html>        
    `;
}