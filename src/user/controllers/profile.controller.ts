import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from '../../auth/dto/update-profile.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { UserId } from '../../common/decorators/user.decorator';
import { UpdateFirebaseNotificationDto, UserProfileDto } from '../dto/user.dto';
import { UserService } from '../user.service';
import { Serialize } from '@app/utils';

@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Profile API')
@Controller({ path: ControllersEnum.Profile, version: APIVersions.V1 })
export class ProfileController {
    constructor(private usersService: UserService) {}

    @Get(Routes[ControllersEnum.Profile].profile)
    async getMyProfile(@UserId() userId: string) {
        return this.usersService.getMyProfile(userId);
    }

    @Patch(Routes[ControllersEnum.Profile].updateProfile)
    async updateMyProfile(@UserId() userId: string, @Body() body: UpdateProfileDto) {
        return this.usersService.updateMyProfile(userId, body);
    }

    // @ApiImageFile({ fieldName: 'avatar', required: true }, { limits: { fileSize: 10 * 1024 * 1024, files: 1 } })
    // @Post(Routes[ControllersEnum.Profile].updateAvatar)
    // updateAvatar(@UserId() userId: string, @UploadedFile() file: Express.Multer.File) {
    //     return this.usersService.updateAvatar(userId, file.buffer);
    // }

    // problem occurred bc header didn't give any platform data,
    // so it always set to "other"
    @ApiOkResponse({ type: UserProfileDto, description: 'Update firebase notification token' })
    @ApiHeader({ name: 'metainfo' })
    @UseGuards(JwtAuthGuard)
    @Patch(Routes[ControllersEnum.Profile].updateFirebaseNotificationToken)
    async updateFirebaseNotification(@Body() dto: UpdateFirebaseNotificationDto, @UserId() userId: string) {
        return this.usersService.updateFirebaseNotificationToken(userId, dto);
    }
}
