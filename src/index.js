const express = require('express');
const cron = require('node-cron');
const { getJobs } = require('./scraper');
const { sendSlackNotification } = require('./notifier');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;

// Son gönderilen ilanları takip etmek için Set
let lastJobIds = new Set();
let isFirstRun = true;

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Cron job
const checkNewJobs = async () => {
    try {
        console.log('İş ilanları kontrol ediliyor...');
        // Random delay ekle (2-5 saniye)
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        const jobs = await getJobs();
        
        if (jobs.length > 0) {
            if (isFirstRun) {
                // İlk çalıştırmada sadece bir ilan gönder (test için)
                console.log('İlk çalıştırma - test bildirimi gönderiliyor...');
                await sendSlackNotification([jobs[0]]);
                isFirstRun = false;
            } else {
                // Yeni ilanları filtrele
                const newJobs = jobs.filter(job => !lastJobIds.has(job.link));
                
                if (newJobs.length > 0) {
                    console.log(`${newJobs.length} yeni ilan bulundu, bildirim gönderiliyor...`);
                    await sendSlackNotification(newJobs);
                } else {
                    console.log('Yeni ilan bulunamadı');
                }
            }
        } else {
            console.log('Hiç ilan bulunamadı');
        }

        // İlanları Set'e ekle
        jobs.forEach(job => lastJobIds.add(job.link));

        // Set'i belirli bir boyutta tut (son 100 ilan)
        if (lastJobIds.size > 100) {
            lastJobIds = new Set([...lastJobIds].slice(-50));
        }

    } catch (error) {
        console.error('Hata:', error);
    }
};

// İlk kontrolü hemen yap
checkNewJobs();

// Cron schedule
cron.schedule(config.cron.interval, checkNewJobs);

// Server'ı başlat
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Upwork takip sistemi başlatıldı...');
    console.log(`Kontrol aralığı: ${config.cron.interval}`);
});
