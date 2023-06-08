type TokenProp = {
    token: string;
};

export type EmailTemplates =
    | {
          template: 'email-verification.handlebars';
          payload: TokenProp;
      }
    | {
          template: 'reset-password.handlebars';
          payload: TokenProp;
      }
    | {
          template: 'email-change.handlebars';
          payload: TokenProp;
      }
    | {
          template: 'account-created.handlebars';
      };
