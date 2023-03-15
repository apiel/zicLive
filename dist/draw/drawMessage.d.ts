export declare enum Message {
    Info = 0,
    Success = 1,
    Error = 2,
    None = 3
}
export declare function drawMessage(_message: string, type?: Message): Promise<void>;
export declare function renderMessage(): void;
export declare function withSuccess<T = void>(message: string, fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T>;
export declare function withInfo<T = void>(message: string, fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T>;
export declare function drawError(message: string): void;
//# sourceMappingURL=drawMessage.d.ts.map