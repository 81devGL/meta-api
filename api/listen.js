module.exports = function({ page, Cli, options }) {
    return async function(callback) {
        const { log, utils } = Cli;
        await page.goto('https://m.facebook.com/messages/t');

        log('Start open client listener...');

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
            payloadData = String.fromCharCode.apply(null, Buffer.from(payloadData, 'base64'));
            payloadData = payloadData.slice(payloadData.indexOf('/')); //.replace(/[^\b][^`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/, '')
            var topic = utils.getRealTopic(payloadData.slice(0, payloadData.indexOf('{')));
            payloadData = payloadData.slice(payloadData.indexOf('{'));

            if (topic) {
                payloadData = JSON.parse(payloadData);
                utils.formatPayloadData(topic, payloadData);
                callback(null, payloadData);
            }
        })
    }
}