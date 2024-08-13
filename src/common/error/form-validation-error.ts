export class FormValidationError<T> extends Error {
    responseBag: any;

    constructor(responseBag: T, message: string) {
        super(message);
        this.responseBag = responseBag;
        this.name = "FormValidationError";
    }
}
