import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient{
constructor(private configService: ConfigService) {
    super({
        datasources: {
            db: {
                url: configService.get<string>('DATABASE_URL'),
            },
        },
    });
    // console.log(config);

}
    cleanDb(){
        return this.$transaction([
            this.alert.deleteMany(),
            this.user.deleteMany(),
        ]);

    }

}
