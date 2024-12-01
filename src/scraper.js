const { chromium } = require("playwright");
const config = require("./config");

const getJobs = async () => {
  let browser;
  try {
    console.log("Browser başlatılıyor...");
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    console.log("Sayfa yükleniyor:", config.upwork.searchUrl);
    await page.goto(config.upwork.searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    console.log("Sayfa yüklendi, bekleme başlıyor...");
    await page.waitForTimeout(10000);

    const pageTitle = await page.title();
    console.log("Sayfa başlığı:", pageTitle);

    // Her bir ilanı tek tek işle
    const jobs = [];
    const elements = await page.$$(".job-tile");
    console.log(`${elements.length} adet ilan işlenecek...`);

    for (const element of elements) {
      try {
        // Doğru selector'lar HTML'den alındı
        const title = await element.$eval(".job-tile-title a", (el) =>
          el?.textContent?.trim()
        );
        const description = await element.$eval(
          '[data-test="UpCLineClamp JobDescription"] p',
          (el) => el?.textContent?.trim()
        );
        const budget = await element
          .$eval('[data-test="job-type-label"] strong', (el) =>
            el?.textContent?.trim()
          )
          .catch(() => "Bütçe belirtilmemiş");
        const link = await element.$eval(".job-tile-title a", (el) => el?.href);
        const postedTime = await element.$eval(
          '[data-test="job-pubilshed-date"]',
          (el) => el?.textContent?.trim()
        );

        // Teknolojileri de alalım
        const skills = await element
          .$$eval('[data-test="token"] span', (elements) =>
            elements.map((el) => el.textContent.trim())
          )
          .catch(() => []);

        console.log("İlan bulundu:", {
          title,
          description: description?.substring(0, 50) + "...",
          budget,
          postedTime,
          skills,
          link,
        });

        if (title && description && link) {
          jobs.push({
            title,
            description,
            budget: budget || "Bütçe belirtilmemiş",
            postedTime,
            skills,
            link,
          });
        }
      } catch (error) {
        console.log("İlan işlenirken hata:", error.message);
        continue;
      }
    }

    console.log(`${jobs.length} adet geçerli ilan bulundu`);
    await browser.close();
    return jobs;
  } catch (error) {
    console.error("İş ilanları çekilirken hata oluştu:", error);
    if (browser) {
      await browser.close();
    }
    return [];
  }
};

module.exports = { getJobs };
