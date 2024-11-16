class ApiResponse {
    constructor(statusCode, message = 'Success', data = null, errors = []) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode >= 200 && statusCode <= 400;
        this.errors = errors;
    } 
}

export default ApiResponse;
