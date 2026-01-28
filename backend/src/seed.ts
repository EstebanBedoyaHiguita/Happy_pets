import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/schemas/user.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if admin already exists
    const existingAdmin = await usersService.findByEmail('admin@happypets.co');
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      await usersService.create({
        name: 'Administrador',
        email: 'admin@happypets.co',
        password: 'admin123',
        role: UserRole.ADMIN,
      });
      console.log('Admin user created successfully');
      console.log('Email: admin@happypets.co');
      console.log('Password: admin123');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }

  await app.close();
}

seed();
