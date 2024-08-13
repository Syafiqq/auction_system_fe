export class NotFoundException extends Error {
    constructor(contentName: string) {
        super(`${contentName} not found`);
    }
}
