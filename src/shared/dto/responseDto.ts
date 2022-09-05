export class ResponseDto {
    public data: any;
    public success: boolean;
    public message: string;
    constructor(data: any, success: boolean, message?: string) {
        this.data = data;
        this.success = success;
        this.message = message ? message : '';
    }
}
