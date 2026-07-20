import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FacultyModule } from './faculty/faculty.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { ReportsModule } from './reports/reports.module';
import { COModule } from './co/co.module';
import { POModule } from './po/po.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FacultyModule,
    SubjectsModule,
    AssessmentsModule,
    ReportsModule,
    COModule,
    POModule,
  ],
})
export class AppModule {}
