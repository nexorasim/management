import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Profile, CarrierType } from './profile.entity';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver(() => Profile)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileResolver {
  constructor(private profileService: ProfileService) {}

  @Query(() => [Profile])
  @Roles('admin', 'operator', 'auditor')
  async profiles(@Args('carrier', { nullable: true }) carrier?: CarrierType): Promise<Profile[]> {
    return this.profileService.findAll(carrier);
  }

  @Query(() => Profile)
  @Roles('admin', 'operator', 'auditor')
  async profile(@Args('id') id: string): Promise<Profile> {
    return this.profileService.findById(id);
  }

  @Mutation(() => Profile)
  @Roles('admin', 'operator')
  async activateProfile(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<Profile> {
    return this.profileService.activate(id, context.req.user.id);
  }

  @Mutation(() => Profile)
  @Roles('admin', 'operator')
  async deactivateProfile(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<Profile> {
    return this.profileService.deactivate(id, context.req.user.id);
  }

  @Query(() => String)
  @Roles('admin', 'operator', 'auditor')
  async profileAnalytics(@Args('carrier', { nullable: true }) carrier?: CarrierType) {
    const analytics = await this.profileService.getAnalytics(carrier);
    return JSON.stringify(analytics);
  }
}