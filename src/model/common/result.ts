export interface Result<T> {
    data: T;
    success: boolean;
    messages: ErrorMessage[];
}

export interface ErrorMessage {
    exception: string;
    message: string;
    status: string;
    requestedUri: string;
    timestamp: string;
}
