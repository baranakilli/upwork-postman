require('dotenv').config();

module.exports = {
    slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL
    },
    upwork: {
        searchUrl: process.env.SEARCH_URL
    },
    cron: {
        interval: process.env.CHECK_INTERVAL
    }
};
