FROM node:18

# Playwright bağımlılıkları
RUN apt-get update && apt-get install -y \
    libwebkit2gtk-4.0-0 \
    libgtk-3-0 \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Playwright browser'ı yükle
RUN npx playwright install chromium

# Kaynak kodları kopyala
COPY . .

# Uygulamayı başlat
CMD ["npm", "start"] 