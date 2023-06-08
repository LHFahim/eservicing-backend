import {
    applyDecorators,
    CanActivate,
    ClassSerializerInterceptor,
    Controller as NestController,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SuperAdminRoleGuard } from '../../auth/guards/role.guard';
import { APIVersions, ControllersEnum } from '../enums';

type PossibleHttpVerbs = 'get' | 'post' | 'put' | 'patch' | 'delete';

type RouteParam = {
    path?: string;
    summary?: string;
    guards?: Guard[];
    method?: PossibleHttpVerbs;
};

const Route = ({ path = '', summary = '', guards = [], method = 'get' }: RouteParam = {}) => {
    const decorators = [ApiOperation({ summary })];

    if (guards.length) decorators.push(UseGuards(...guards));

    const routeType: Record<PossibleHttpVerbs, any> = {
        get: Get,
        post: Post,
        put: Put,
        patch: Patch,
        delete: Delete,
    };

    return applyDecorators(...decorators, routeType[method](path));
};

const RouteObj = ({ path = '', summary = '' }: { path?: string; summary?: string } = {}) => ({ summary, path });

type Guard = new (...args: any[]) => CanActivate;

type ControllerParams = {
    path: string;
    guards?: Guard[];
    description: string;
    version?: APIVersions;
};

export const Controller = ({ description, guards, path, version = APIVersions.V1 }: ControllerParams) => {
    const decorators = [
        UseInterceptors(ClassSerializerInterceptor),
        SerializeOptions({
            strategy: 'exposeAll',
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
            exposeDefaultValues: true,
        }),
        ApiBearerAuth(),
        ApiTags(description),
        NestController({ path, version }),
    ];

    if (guards?.length) decorators.push(UseGuards(...guards));

    return applyDecorators(...decorators);
};

// super admin
const SuperAdminAuthRoutes = {
    controller: Controller({
        description: 'Super Admin -> Auth',
        path: ControllersEnum.SuperAdminAuth,
    }),

    login: RouteObj({
        path: 'login',
        summary: 'Login',
    }),
};
const SuperAdminCompanyRoutes = {
    controller: Controller({
        description: 'Super Admin -> Company Routes',
        path: ControllersEnum.SuperAdminCompanies,
        guards: [JwtAuthGuard, SuperAdminRoleGuard],
    }),
    list: RouteObj({
        path: '',
        summary: 'Get all Companies',
    }),
    add: RouteObj({ path: '', summary: 'Add company' }),
    logo: RouteObj({ path: 'logo', summary: 'Upload logo' }),
    get: RouteObj({ path: ':id', summary: 'Get company' }),
    update: RouteObj({ path: ':id', summary: 'Update company' }),
    delete: RouteObj({ path: ':id', summary: 'Delete company' }),
    manage: RouteObj({ path: ':id/status', summary: 'Mange Active/Deactivate state of a company' }),
    // routes: {
    //     list: Route({
    //         summary: 'Get all Companies',
    //     }),
    //     add: Route({ summary: 'Add company', method: 'post' }),
    //     logo: Route({ path: 'logo', summary: 'Upload logo', method: 'post' }),
    //     get: Route({ path: ':id', summary: 'Get company', method: 'get' }),
    //     update: Route({ path: ':id', summary: 'Update company', method: 'patch' }),
    //     delete: Route({ path: ':id', summary: 'Delete company', method: 'delete' }),
    //     manage: Route({ path: ':id/status', summary: 'Mange Active/Deactivate state of a company', method: 'post' }),
    // },
};
const SuperAdminChapterRoutes = {
    controller: Controller({
        description: 'Super Admin -> Chapter',
        path: ControllersEnum.SuperAdminChapters,
        guards: [JwtAuthGuard, SuperAdminRoleGuard],
    }),

    chapters: RouteObj({ summary: 'Get all chapters' }),
    createChapter: RouteObj({
        summary: 'Create a chapter',
    }),
    uploadChapterImage: RouteObj({
        path: 'image',
        summary: 'Upload chapter image',
    }),
    chaptersOrderUpdate: RouteObj({
        path: 'order',
        summary: 'Chapters order update',
    }),
    getChapter: RouteObj({
        path: ':id',
        summary: 'Get a chapter',
    }),
    updateChapter: RouteObj({
        path: ':id',
        summary: 'Update a chapter',
    }),

    deleteChapter: RouteObj({
        path: ':id',
        summary: 'Delete a chapter',
    }),

    chapterStatusUpdate: RouteObj({
        path: ':id/status',
        summary: 'update a chapters active status',
    }),

    publishChapter: RouteObj({
        path: ':id/publish',
        summary: 'Publish a chapter',
    }),
};
const SuperAdminEnergyListRoutes = {
    controller: Controller({
        description: 'Super Admin -> Energy List',
        path: ControllersEnum.SuperAdminEnergyList,
        guards: [JwtAuthGuard, SuperAdminRoleGuard],
    }),

    list: RouteObj({
        path: '',
        summary: 'Get all energy list',
    }),
    createEnergy: RouteObj({
        path: '',
        summary: 'Create a energy',
    }),
    updateEnergy: RouteObj({
        path: ':id',
        summary: 'Update a energy',
    }),
    deleteEnergy: RouteObj({
        path: ':id',
        summary: 'Delete a energy',
    }),

    // routes: {
    //     list: Route({
    //         summary: 'Get all energy list',
    //     }),
    //     createEnergy: Route({
    //         summary: 'Create a energy',
    //         method: 'post',
    //     }),
    //     updateEnergy: Route({
    //         path: ':id',
    //         summary: 'Update a energy',
    //         method: 'patch',
    //     }),
    //     deleteEnergy: Route({
    //         path: ':id',
    //         summary: 'Delete a energy',
    //         method: 'delete',
    //     }),
    // },
};
const SuperAdminCategoryRoutes = {
    controller: Controller({
        description: 'SuperAdmin -> Category APIs',
        path: ControllersEnum.SuperAdminCategories,
        guards: [JwtAuthGuard, SuperAdminRoleGuard],
    }),
    findAllCategories: RouteObj({
        path: '',
        summary: 'Get all categories',
    }),
    createCategory: RouteObj({
        path: '',

        summary: 'Create a category',
    }),
    updateCategory: RouteObj({
        path: ':id',
        summary: 'Update a category',
    }),
    deleteCategory: RouteObj({
        path: ':id',
        summary: 'Delete a category',
    }),
    // routes: {
    //     findAllCategories: Route({
    //         summary: 'Get all categories',
    //         method: 'get',
    //     }),
    //     createCategory: Route({
    //         summary: 'Create a category',
    //         method: 'post',
    //     }),
    //     updateCategory: Route({
    //         path: ':id',
    //         summary: 'Update a category',
    //         method: 'patch',
    //     }),
    //     deleteCategory: Route({
    //         path: ':id',
    //         summary: 'Delete a category',
    //         method: 'delete',
    //     }),
    // },
};

const SuperAdminDiaryRoutes = {
    controller: Controller({
        description: 'Super Admin -> Diary',
        path: ControllersEnum.SuperAdminDiary,
        guards: [JwtAuthGuard, SuperAdminRoleGuard],
    }),
    findAllDiaries: RouteObj({
        path: '',
        summary: 'Get all diaries',
    }),
    createDiary: RouteObj({
        path: '',
        summary: 'Create a diary',
    }),
    updateDiary: RouteObj({
        path: ':id',
        summary: 'Update a diary',
    }),
    updateDiaryByOrder: RouteObj({
        path: 'order',
        summary: 'Update a diaries order',
    }),
    deleteDiary: RouteObj({
        path: ':id',
        summary: 'Delete a diary',
    }),
    // routes: {
    //     findAllDiaries: Route({
    //         summary: 'Get all diaries',
    //     }),
    //     createDiary: Route({
    //         summary: 'Create a diary',
    //         method: 'post',
    //     }),
    //     updateDiary: Route({
    //         path: ':id',
    //         summary: 'Update a diary',
    //         method: 'patch',
    //     }),
    //     updateDiaryByOrder: Route({
    //         path: ':id/order',
    //         summary: 'Update a diary By Order',
    //         method: 'patch',
    //     }),
    //     deleteDiary: Route({
    //         path: ':id',
    //         summary: 'Delete a diary',
    //         method: 'delete',
    //     }),
    // },
};
const SuperAdminUsersRoutes = {
    controller: Controller({
        description: 'Super Admin -> Users',
        path: ControllersEnum.SuperAdminUsers,
        guards: [JwtAuthGuard, SuperAdminRoleGuard],
    }),
    findUsersForSuperAdmin: RouteObj({
        path: ':companyId',
        summary: 'Get all company users',
    }),
    manage: RouteObj({
        path: ':companyId/:id/status',
        summary: 'Mange Active/Deactivate state of a user',
    }),
    delete: RouteObj({
        path: ':companyId/:id',
        summary: 'Delete a user',
    }),
};

const SuperAdminAppreciateRoutes = {
    controller: Controller({
        description: 'SuperAdmin -> Appreciate APIs',
        path: ControllersEnum.SuperAdminAppreciate,
        guards: [JwtAuthGuard, SuperAdminRoleGuard],
    }),
    findAppreciate: RouteObj({
        path: 'appreciate/info',
        summary: 'Get appreciation info',
    }),

    updateAppreciate: RouteObj({
        path: 'appreciate/info',
        summary: 'Update a appreciation info',
    }),
};

export const Routes = {
    superAdmin: {
        auth: SuperAdminAuthRoutes,
        users: SuperAdminUsersRoutes,
    },

    [ControllersEnum.Auth]: {
        loginByEmail: 'login/email',
        // loginBySocial: 'login/social',
        registerByEmail: 'register/email',

        verifyJoinCode: 'join-code/verify',

        // registerBySocial: 'register/social',
        refreshJwtToken: 'refresh/jwt-token',
        // sendRegistrationOtp: 'send-registration-otp',
        resetPasswordSendCode: 'reset-password/send-otp',
        resetPasswordVerifyCode: 'reset-password/verify-otp',
        resetPassword: 'reset-password',
        changePassword: 'change-password',
        // changeEmailSendCode: 'change-email/send-otp',
        // changeEmailVerifyCode: 'change-email/verify-otp',
        // changeEmailSendCodeForNewEmail: 'change-email/new-email-send-otp',
        // changeEmailVerifyCodeForNewEmail: 'change-email/new-email-verify-otp',
        // changeEmail: 'change-email',
        logout: 'logout',
    },
    [ControllersEnum.Profile]: {
        profile: '',
        updateProfile: '',
        updateAvatar: 'avatar',
        updateFirebaseNotificationToken: 'notification-token',
    },
    [ControllersEnum.Roles]: {},
    [ControllersEnum.Users]: {},
} as const;
