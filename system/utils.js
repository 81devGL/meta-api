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
    let event = {};
    switch (topic) {
        case '/t_ms': {
            if (payloadData.deltas) {
                for (let delta of payloadData.deltas) {
                    switch (delta.class) {
                        case 'NewMessage': {
                            event.type = 'message';
                            event.body = delta.body || '';
                            event.attachments = getAttachments(delta.attachments);
                            event.senderID = parseInt(delta.messageMetadata.actorFbId);
                            event.threadID = parseInt(delta.messageMetadata.threadKey.threadFbId || delta.messageMetadata.threadKey.otherUserFbId);
                            event.messageID = delta.messageMetadata.messageId;
                            event.timestamp = parseInt(delta.messageMetadata.timestamp);
                            event.isGroup = delta.messageMetadata.threadKey.hasOwnProperty('threadFbId');
                            return event;
                        }
                        case 'ClientPayload': {
                            let { payload } = delta;
                            payload = decodeClientPayload(payload);
                            for (let delta of payload.deltas) {
                                if (delta.deltaMessageReply) {
                                    event.type = 'message_reply';
                                    event.body = delta.deltaMessageReply.message.body || '';
                                    event.attachments = delta.deltaMessageReply.message.attachments;
                                    event.senderID = delta.deltaMessageReply.message.messageMetadata.actorFbId;
                                    event.threadID = delta.deltaMessageReply.message.messageMetadata.threadKey.threadFbId || delta.deltaMessageReply.message.messageMetadata.threadKey.otherUserFbId;
                                    event.messageID = delta.deltaMessageReply.message.messageMetadata.messageId;
                                    event.replyToMessage = {
                                        body: delta.deltaMessageReply.repliedToMessage.body || '',
                                        attachments: delta.deltaMessageReply.repliedToMessage.attachments,
                                        messageID: delta.deltaMessageReply.repliedToMessage.messageMetadata.messageId,
                                        senderID: delta.deltaMessageReply.repliedToMessage.messageMetadata.actorFbId,
                                        threadID: delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.threadFbId || delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.otherUserFbId,
                                        timestamp: delta.deltaMessageReply.repliedToMessage.messageMetadata.timestamp,
                                        isGroup: delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.hasOwnProperty('threadFbId')
                                    }
                                    event.timestamp = delta.deltaMessageReply.message.messageMetadata.timestamp;
                                    event.isGroup = delta.deltaMessageReply.message.messageMetadata.threadKey.hasOwnProperty('threadFbId');
                                    return event;
                                }
                                if (delta.deltaMessageReaction) {
                                    event.type = 'message_reaction';
                                    event.messageID = delta.deltaMessageReaction.messageId;
                                    event.reaction = delta.deltaMessageReaction.reaction;
                                    event.senderID = delta.deltaMessageReaction.senderId || delta.deltaMessageReaction.userId;
                                    event.reactionID = delta.deltaMessageReaction.userId;
                                    event.threadID = delta.deltaMessageReaction.threadKey.threadFbId || delta.deltaMessageReaction.threadKey.otherUserFbId;
                                    event.isGroup = delta.deltaMessageReaction.threadKey.hasOwnProperty('threadFbId');
                                    return event;
                                }
                                if (delta.deltaRecallMessageData) {
                                    event.type = 'message_deletion';
                                    event.senderID = delta.deltaRecallMessageData.senderID;
                                    event.deletionTime = delta.deltaRecallMessageData.deletionTimestamp;
                                    event.messageID = delta.deltaRecallMessageData.messageID;
                                    event.threadID = delta.deltaRecallMessageData.threadKey.threadFbId || delta.deltaRecallMessageData.threadKey.otherUserFbId;
                                    event.isGroup = delta.deltaRecallMessageData.threadKey.hasOwnProperty('threadFbId');
                                    return event;
                                }
                            }
                            break;
                        }
                        case 'noOp':
                            break;
                        case 'MarkFolderSeen': {
                            // console.log('MarkFolderSeen', delta);
                            break;
                        }
                        case 'ReadReceipt': {
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            break;
        }
        case 'more': {
            break;
        }
        default: {
            // console.log(payloadData)
            // console.log(topic);
            // return payloadData;
            break;
        }
    }
    // Working...
}

function getAttachments(attachments) {
    // Working...
    return [];
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
