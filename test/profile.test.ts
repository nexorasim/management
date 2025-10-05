import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileService } from '../src/profile/profile.service';
import { Profile, ProfileStatus, CarrierType } from '../src/profile/profile.entity';
import { AuditService } from '../src/audit/audit.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockRepository: any;
  let mockAuditService: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      count: jest.fn(),
    };

    mockAuditService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  describe('findAll', () => {
    it('should return all profiles', async () => {
      const profiles = [
        { id: '1', iccid: '123', carrier: CarrierType.MPT },
        { id: '2', iccid: '456', carrier: CarrierType.ATOM },
      ];
      mockRepository.find.mockResolvedValue(profiles);

      const result = await service.findAll();
      expect(result).toEqual(profiles);
      expect(mockRepository.find).toHaveBeenCalledWith({ where: {} });
    });

    it('should filter by carrier', async () => {
      const profiles = [{ id: '1', iccid: '123', carrier: CarrierType.MPT }];
      mockRepository.find.mockResolvedValue(profiles);

      const result = await service.findAll(CarrierType.MPT);
      expect(result).toEqual(profiles);
      expect(mockRepository.find).toHaveBeenCalledWith({ 
        where: { carrier: CarrierType.MPT } 
      });
    });
  });

  describe('activate', () => {
    it('should activate profile and log audit', async () => {
      const profile = {
        id: '1',
        iccid: '123',
        carrier: CarrierType.MPT,
        status: ProfileStatus.INACTIVE,
      };
      
      mockRepository.findOne.mockResolvedValue(profile);
      mockRepository.save.mockResolvedValue({
        ...profile,
        status: ProfileStatus.ACTIVE,
        lastActivatedAt: expect.any(Date),
      });

      const result = await service.activate('1', 'user123');

      expect(result.status).toBe(ProfileStatus.ACTIVE);
      expect(mockAuditService.log).toHaveBeenCalledWith({
        action: 'PROFILE_ACTIVATED',
        entityId: '1',
        userId: 'user123',
        metadata: { carrier: CarrierType.MPT, iccid: '123' },
      });
    });
  });

  describe('getAnalytics', () => {
    it('should return profile analytics', async () => {
      mockRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(60)  // active
        .mockResolvedValueOnce(40); // inactive

      const result = await service.getAnalytics();

      expect(result).toEqual({
        total: 100,
        active: 60,
        inactive: 40,
        carrier: undefined,
      });
    });
  });
});