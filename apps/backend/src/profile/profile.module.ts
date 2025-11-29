import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UploadImageModule } from '../upload-image/upload-image.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, UploadImageModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService], // Export ProfileService so AuthService can use it if needed (though AuthService currently uses Repository)
})
export class ProfileModule {}
