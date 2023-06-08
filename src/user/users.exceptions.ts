import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
    constructor() {
        super({ key: 'USERS.USER_NOT_FOUND' });
    }
}

export class UserInvalidRefreshTokenException extends UnauthorizedException {
    constructor() {
        super({ key: 'USERS.INVALID_REFRESH_TOKEN' });
    }
}

export class UserInvalidRoleException extends UnauthorizedException {
    constructor() {
        super({ key: 'USERS.INVALID_USER_ROLE' });
    }
}

export class UserAlreadyExistsException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.ALREADY_EXISTS' });
    }
}

export class UserNotVerifiedException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.NOT_VERIFIED_YET' });
    }
}

export class UserAlreadyVerifiedException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.ALREADY_VERIFIED' });
    }
}

export class UserInvalidCredentialException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.INVALID_CREDENTIAL' });
    }
}

export class UserInvalidEmailOrPasswordException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.INVALID_EMAIL_OR_PASSWORD' });
    }
}

export class UserInvalidVerificationOTPException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.INVALID_USER_VERIFICATION_OTP' });
    }
}

export class UserInvalidPasswordException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.INVALID_OLD_PASSWORD' });
    }
}

export class FirebaseInvalidUserException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.INVALID_FIREBASE_USER' });
    }
}

export class FirebaseUserEmailNotVerifiedException extends BadRequestException {
    constructor() {
        super({ key: 'USERS.FIREBASE_USER_EMAIL_NOT_VERIFIED' });
    }
}

export class FirebaseInvalidAuthTokenException extends BadRequestException {
    constructor(message: string) {
        super({ message, key: 'USERS.INVALID_FIREBASE_TOKEN' });
    }
}

export class UnsupportedNotificationPlatformException extends BadRequestException {
    constructor(platform: string) {
        super({ key: 'USERS.UNSUPPORTED_NOTIFICATION_PLATFORM', args: { platform } });
    }
}
