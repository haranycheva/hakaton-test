import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

// Зберігаємо екземпляр додатка для перевикористання
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    
    // Додайте ваші префікси, корси, пайпи тут:
    app.setGlobalPrefix('api'); 
    app.enableCors();

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

// Цей експорт КРИТИЧНО важливий для Vercel
export default async (req: any, res: any) => {
  const app = await bootstrap();
  return app(req, res);
};

// Залишаємо для локальної розробки (npm run start)
if (process.env.NODE_ENV !== 'production') {
  async function startLocal() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log('Server running on http://localhost:3000');
  }
  // startLocal(); // Розкоментуйте, якщо запускаєте просто через node
}