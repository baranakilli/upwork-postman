require('dotenv').config();

module.exports = {
    slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL
    },
    upwork: {
        searchUrl: process.env.SEARCH_URL,
        headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    },
    cron: {
        interval: process.env.CHECK_INTERVAL
    }
};
