export type SignUpBody = {
    email: string,
    username: string,
    password: string
};

export type SignInBody = {
    username: string,
    password: string,
    remember: boolean
}

 declare module "express-session" {
    interface Session {
        username: string;
    }
}