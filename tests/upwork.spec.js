const { test, expect } = require('@playwright/test');
const config = require('../src/config');
const path = require('path');
const fs = require('fs');

// Debug çıktıları için klasör oluştur
const DEBUG_DIR = path.join(__dirname, 'debug');
if (!fs.existsSync(DEBUG_DIR)) {
    fs.mkdirSync(DEBUG_DIR, { recursive: true });
}

test('get upwork jobs', async ({ page }) => {
    console.log('Test başlıyor...');
    
    try {
        // Sayfaya git
        await page.goto(config.upwork.searchUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        // Screenshot'ları debug klasörüne kaydet
        await page.screenshot({ 
            path: path.join(DEBUG_DIR, 'initial-load.png'), 
            fullPage: true 
        });
        
        console.log('Sayfa yüklendi, bekleme başlıyor...');
        await page.waitForTimeout(10000);

        // Sayfanın yüklenip yüklenmediğini kontrol et
        const pageTitle = await page.title();
        console.log('Sayfa başlığı:', pageTitle);
        
        // HTML içeriğini debug klasörüne kaydet
        const content = await page.content();
        fs.writeFileSync(
            path.join(DEBUG_DIR, 'page-content.html'), 
            content
        );
        console.log('Sayfa içeriği uzunluğu:', content.length);
        
        // Sayfada herhangi bir element var mı kontrol et
        const bodyContent = await page.$eval('body', el => el.textContent);
        console.log('Body içeriği var mı:', bodyContent.length > 0);
        
        // Son durumu kaydet
        await page.screenshot({ 
            path: path.join(DEBUG_DIR, 'before-selectors.png'), 
            fullPage: true 
        });
        
        // Farklı selektörleri dene
        for (const selector of [
            'section[data-test="JobTile"]',
            '.job-tile',
            '[data-job-title]',
            'article',
            '.up-card-section'
        ]) {
            console.log(`Selector deneniyor: ${selector}`);
            const elements = await page.$$(selector);
            if (elements.length > 0) {
                console.log(`${selector} ile ${elements.length} eleman bulundu`);
                return elements;
            }
        }
        
        throw new Error('Hiçbir iş ilanı bulunamadı');
        
    } catch (error) {
        console.error('Hata:', error);
        // HTML içeriğini kaydet
        const content = await page.content().catch(() => 'Page already closed');
        require('fs').writeFileSync('error-page-content.html', content);
        throw error;
    }
}); 