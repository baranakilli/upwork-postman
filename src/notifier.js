const axios = require('axios');
const config = require('./config');

const sendSlackNotification = async (jobs) => {
    if (!jobs || jobs.length === 0) {
        console.log('Gönderilecek yeni iş ilanı yok');
        return;
    }

    try {
        // Her bir iş ilanı için ayrı mesaj bloğu oluştur
        const blocks = jobs.flatMap(job => [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🆕 Yeni Upwork İlanı",
                    emoji: true
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${job.title}*`
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Bütçe:*\n${job.budget}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Yayınlanma:*\n${job.postedTime}`
                    }
                ]
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Açıklama:*\n${job.description.substring(0, 300)}...`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Teknolojiler:*\n${job.skills ? job.skills.join(', ') : 'Belirtilmemiş'}`
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "İlanı Görüntüle",
                            emoji: true
                        },
                        url: job.link,
                        style: "primary"
                    }
                ]
            },
            {
                type: "divider"
            }
        ]);

        // Slack API'ye gönder
        await axios.post(config.slack.webhookUrl, {
            blocks: blocks
        });

        console.log(`${jobs.length} adet yeni ilan için Slack bildirimi gönderildi`);
    } catch (error) {
        console.error('Slack bildirimi gönderilirken hata oluştu:', error);
    }
};

module.exports = { sendSlackNotification }; 