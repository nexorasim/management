"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const profile_service_1 = require("../src/profile/profile.service");
const profile_entity_1 = require("../src/profile/profile.entity");
const audit_service_1 = require("../src/audit/audit.service");
describe('ProfileService', () => {
    let service;
    let mockRepository;
    let mockAuditService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                profile_service_1.ProfileService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(profile_entity_1.Profile),
                    useValue: mockRepository,
                },
                {
                    provide: audit_service_1.AuditService,
                    useValue: mockAuditService,
                },
            ],
        }).compile();
        service = module.get(profile_service_1.ProfileService);
    });
    describe('findAll', () => {
        it('should return all profiles', async () => {
            const profiles = [
                { id: '1', iccid: '123', carrier: profile_entity_1.CarrierType.MPT },
                { id: '2', iccid: '456', carrier: profile_entity_1.CarrierType.ATOM },
            ];
            mockRepository.find.mockResolvedValue(profiles);
            const result = await service.findAll();
            expect(result).toEqual(profiles);
            expect(mockRepository.find).toHaveBeenCalledWith({ where: {} });
        });
        it('should filter by carrier', async () => {
            const profiles = [{ id: '1', iccid: '123', carrier: profile_entity_1.CarrierType.MPT }];
            mockRepository.find.mockResolvedValue(profiles);
            const result = await service.findAll(profile_entity_1.CarrierType.MPT);
            expect(result).toEqual(profiles);
            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { carrier: profile_entity_1.CarrierType.MPT }
            });
        });
    });
    describe('activate', () => {
        it('should activate profile and log audit', async () => {
            const profile = {
                id: '1',
                iccid: '123',
                carrier: profile_entity_1.CarrierType.MPT,
                status: profile_entity_1.ProfileStatus.INACTIVE,
            };
            mockRepository.findOne.mockResolvedValue(profile);
            mockRepository.save.mockResolvedValue({
                ...profile,
                status: profile_entity_1.ProfileStatus.ACTIVE,
                lastActivatedAt: expect.any(Date),
            });
            const result = await service.activate('1', 'user123');
            expect(result.status).toBe(profile_entity_1.ProfileStatus.ACTIVE);
            expect(mockAuditService.log).toHaveBeenCalledWith({
                action: 'PROFILE_ACTIVATED',
                entityId: '1',
                userId: 'user123',
                metadata: { carrier: profile_entity_1.CarrierType.MPT, iccid: '123' },
            });
        });
    });
    describe('getAnalytics', () => {
        it('should return profile analytics', async () => {
            mockRepository.count
                .mockResolvedValueOnce(100)
                .mockResolvedValueOnce(60)
                .mockResolvedValueOnce(40);
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
//# sourceMappingURL=profile.test.js.map