FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Uygulamayı başlat
CMD ["npm", "start"] 