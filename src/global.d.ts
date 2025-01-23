export {}
declare global{
    interface AuthType {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            username: string;
        }
    }    
}