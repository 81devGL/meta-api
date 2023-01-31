function getTime(format) {
    const moment = require("moment-timezone").tz("Asia/Ho_Chi_Minh");
    return format ? moment.format(format) : moment.format("HH:mm:ss DD/MM/YYYY");
}

function getRealTopic(topic) {
    var topics = [
        "/t_ms",
        "/thread_typing",
        "/orca_typing_notifications",
        "/orca_presence",
        "/legacy_web",
        "/br_sr",
        "/sr_res",
        "/webrtc",
        "/onevc",
        "/notify_disconnect",
        "/inbox",
        "/mercury",
        "/messaging_events",
        "/orca_message_notifications",
        "/pp",
        "/webrtc_response",
    ];

    for (let i of topics) {
        let Regexp = new RegExp(i, 'g');
        if (Regexp.test(topic)) return i;
    }
}

function formatPayloadData(topic, payloadData) {
    //Working
}

function decodeClientPayload(payloadData) {
    return JSON.parse(String.fromCharCode.apply(null, payloadData));
}

module.exports = {
    getTime,
    getRealTopic,
    formatPayloadData,
    decodeClientPayload
}