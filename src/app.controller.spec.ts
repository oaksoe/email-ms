import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail.service';
import { SendGridMailService } from './sendGridMail.service';

const mailServiceProvider = {
  provide: MailService,
  useClass:
    process.env.MAIL_SERVICE_EXTERNAL === 'SendGrid'
      ? SendGridMailService
      : MailService,
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        mailServiceProvider,
        {
          provide: 'QueueService',
          useFactory: () => ({
            publishEvent: jest.fn(() => { return; }),
          }),
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the service status', () => {
      expect(appController.getServiceStatus()).toBe('Email service is running in test environment.');
    });

    it('should throw exception when sending mail', async() => {
      const errorMessage = process.env.MAIL_SERVICE_EXTERNAL ? 
        'Exception occurred while sending mail using SendGrid: Unauthorized' :
        'External Mail delivery service is not configured.';

      try {
        await appController.sendMail({
          to: 'test to',
          subject: 'test subject',
          content: 'test content',
        })
      } catch(err) {
        expect(err.message).toBe(errorMessage);
      }
    });
  });
});
