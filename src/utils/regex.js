export const getMailsInMention = (mentionText) => {
    const mailInmentions = [];
    const regex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    let match;
    while ((match = regex.exec(mentionText))) {
        mailInmentions.push(match[1]);
    }
    return mailInmentions;
};
