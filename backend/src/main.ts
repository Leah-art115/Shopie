/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './common/guards/roles.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  process.on('beforeExit', async () => {
    await app.close();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
