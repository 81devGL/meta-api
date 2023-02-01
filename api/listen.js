module.exports = function({ page, Cli, options }) {
    return async function(callback) {
        try {
            const { log, utils } = Cli;
            await page.goto('https://m.facebook.com/messages/t');
    
            var client = await page.target().createCDPSession();
    
            await client.send('Network.enable');
    
            await client.on('Network.webSocketCreated', ({requestId, url}) => {
                if (options.debugMode) console.log('Network.webSocketCreated', requestId, url, '\n')
            })
                
            await client.on('Network.webSocketClosed', ({requestId, timestamp}) => {
                if (options.debugMode) console.log('Network.webSocketClosed', requestId, timestamp, '\n')
            })
                
            await client.on('Network.webSocketFrameSent', ({requestId, timestamp, response}) => {
                if (options.debugMode) console.log('Network.webSocketFrameSent', requestId, timestamp, response.payloadData, '\n')
            })
            
            await client.on('Network.webSocketFrameReceived', ({requestId, timestamp, response: { payloadData }}) => {
                payloadData = Buffer.from(payloadData, 'base64').toString('utf8');
                payloadData = payloadData.slice(payloadData.indexOf('/'));
                var topic = utils.getRealTopic(payloadData.slice(0, payloadData.indexOf('{')));
                payloadData = payloadData.slice(payloadData.indexOf('{'));
    
                if (topic) {
                    payloadData = JSON.parse(payloadData);
                    if (callback) callback(null, utils.formatPayloadData(topic, payloadData));
                }
            })
        } catch (error) {
            if (callback) callback(error, null);
        }
    }
}
