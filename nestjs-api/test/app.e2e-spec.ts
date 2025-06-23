import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { CreateAlertDto } from './../src/alert/dto/create-alert.dto';
import { UserRole } from '@prisma/client';

describe('CropAlert E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333');

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  const agronomistDto: AuthDto = {
    email: 'agronomist@test.com',
    password: 'password123',
    role: UserRole.AGRONOMIST,
  };

  const farmerDto: AuthDto = {
    email: 'farmer@test.com',
    password: 'password123',
    role: UserRole.FARMER,
  };

  describe('Auth', () => {
    describe('Signup Agronomist', () => {
      it('should signup agronomist', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(agronomistDto)
          .expectStatus(201);
      });
    });

    describe('Signup Farmer', () => {
      it('should signup farmer', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(farmerDto)
          .expectStatus(201);
      });
    });

    describe('Signin Agronomist', () => {
      it('should signin and store token', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: agronomistDto.email,
            password: agronomistDto.password,
          })
          .expectStatus(200)
          .stores('agronomistToken', 'access_token');
      });
    });

    describe('Signin Farmer', () => {
      it('should signin and store token', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: farmerDto.email,
            password: farmerDto.password,
          })
          .expectStatus(200)
          .stores('farmerToken', 'access_token');
      });
    });
  });

  describe('Alerts', () => {
    let createdAlertId: number;

    const createAlertDto: CreateAlertDto = {
      title: 'Severe Heatwave',
      description: 'Heat warning for sensitive crops',
      location: [-7.93879, 32.14118],
      crops: ['wheat', 'corn'],
      severity: 'HIGH',
    };

    it('Agronomist should create alert', () => {
      return pactum
        .spec()
        .post('/alerts')
        .withHeaders({
          Authorization: 'Bearer $S{agronomistToken}',
        })
        .withBody(createAlertDto)
        .expectStatus(201)
        .stores('alertId', 'id');
    });

    it('Farmer should NOT be able to create alert', () => {
      return pactum
        .spec()
        .post('/alerts')
        .withHeaders({
          Authorization: 'Bearer $S{farmerToken}',
        })
        .withBody(createAlertDto)
        .expectStatus(403);
    });

    it('Get my alerts (agronomist)', () => {
      return pactum
        .spec()
        .get('/alerts')
        .withHeaders({
          Authorization: 'Bearer $S{agronomistToken}',
        })
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('Search nearby alerts (exact matching)', () => {
      return pactum
        .spec()
        .get('/alerts/nearby/search')
        .withHeaders({
          Authorization: 'Bearer $S{farmerToken}',
        })
        .withQueryParams({
          lat: 32.14118,
          lng: -7.93879,
          radius: 10,
          crops: ['wheat', 'corn'],
        })
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('Search nearby with no results (wrong coordinates)', () => {
      return pactum
        .spec()
        .get('/alerts/nearby/search')
        .withHeaders({
          Authorization: 'Bearer $S{farmerToken}',
        })
        .withQueryParams({
          lat: 48.8566,
          lng: 2.3522,
          radius: 5,
        })
        .expectStatus(200)
        .expectBody([]);
    });

    it('Should throw on invalid radius (backend validation)', () => {
      return pactum
        .spec()
        .get('/alerts/nearby/search')
        .withHeaders({
          Authorization: 'Bearer $S{farmerToken}',
        })
        .withQueryParams({
          lat: 32.14118,
          lng: -7.93879,
          radius: 0,
        })
        .expectStatus(403);
    });
  });
});
