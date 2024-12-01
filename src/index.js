const cron = require('node-cron');
const { getJobs } = require('./scraper');
const { sendSlackNotification } = require('./notifier');
const config = require('./config');

// Son gönderilen ilanları takip etmek için
let lastJobIds = new Set();
let isFirstRun = true; // İlk çalıştırma kontrolü için flag ekledik

const checkNewJobs = async () => {
    try {
        console.log('İş ilanları kontrol ediliyor...');
        const jobs = await getJobs();
        
        if (jobs.length > 0) {
            if (isFirstRun) {
                console.log('Test bildirimi gönderiliyor...');
                await sendSlackNotification([jobs[0]]);
                isFirstRun = false;
            } else {
                const newJobs = jobs.filter(job => !lastJobIds.has(job.link));
                if (newJobs.length > 0) {
                    await sendSlackNotification(newJobs);
                } else {
                    console.log('Yeni ilan bulunamadı');
                }
            }
        } else {
            console.log('Hiç ilan bulunamadı');
        }

        jobs.forEach(job => lastJobIds.add(job.link));
        
        if (lastJobIds.size > 100) {
            lastJobIds = new Set([...lastJobIds].slice(-50));
        }
    } catch (error) {
        console.error('İşlem sırasında hata oluştu:', error);
    }
};

// İlk kontrolü hemen yap
checkNewJobs();

// Sonra normal cron schedule'a geç
cron.schedule(config.cron.interval, checkNewJobs);

console.log('Upwork takip sistemi başlatıldı...');
console.log(`Kontrol aralığı: ${config.cron.interval}`);
