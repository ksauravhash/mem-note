export { }
declare global {
    
    interface AuthType {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            username: string;
            email: string;
            verified?: boolean;
        },
    }
    type NoteBlockType = "word" | "description" | "image" | "audio";

    type noteBlock = {
        type: NoteBlockType;
        content: string;
        sequenceNumber: number;
        answer: boolean;
    }
}