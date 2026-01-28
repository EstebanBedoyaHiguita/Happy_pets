import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.argv[2];
  if (!email) {
    console.error('Por favor proporciona un email: npx ts-node src/scripts/make-admin.ts email@example.com');
    process.exit(1);
  }

  try {
    const user = await usersService.findByEmail(email);
    if (!user) {
      console.error(`Usuario con email ${email} no encontrado`);
      process.exit(1);
    }

    await usersService.update(user._id.toString(), { role: UserRole.ADMIN });
    console.log(`Usuario ${email} actualizado a rol ADMIN exitosamente`);
  } catch (error) {
    console.error('Error:', error.message);
  }

  await app.close();
}

bootstrap();
