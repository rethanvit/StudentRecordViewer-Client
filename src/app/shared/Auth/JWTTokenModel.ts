export interface JWTTokenModel {
    sub: string,
    aud: string,
    iss: string,
    nbf: number,
    exp: number,
    userName: string,
    userRole: string
}