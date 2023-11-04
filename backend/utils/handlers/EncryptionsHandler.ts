import jwt from "jsonwebtoken";
import crypto from "crypto";
export class Encryptions {
  /**
   * Signs a payload with the JWT secret
   * @param {string|object|Buffer} payload
   * @param {string|number} expiresIn - The time until the token expires (eg. 1h, 1d, 1y) or a timestamp
   * @return {Promise<String>}
   */
  static encrypt(
    payload: string | object | Buffer,
    expiresIn?: string | number
  ) {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
    return new Promise((res, rej) =>
      jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        {
          algorithm: "RS512",
          expiresIn: expiresIn || "14d",
          issuer: "finapp",
        },
        (er, encrypted) => (er ? rej(er) : res(encrypted))
      )
    );
  }
  /**
   * Decrypts a payload with the JWT secret
   * @param {string} encryptedPayload
   * @return {Promise<string|object|Buffer>}
   */
  static decrypt(encryptedPayload: string) {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
    return new Promise((res, rej) =>
      jwt.verify(
        encryptedPayload,
        process.env.JWT_SECRET!,
        { algorithms: ["RS512"] },
        (er, decrypted) => (er ? rej(er) : res(decrypted))
      )
    );
  }
  static issueUserAccessToken(userID: string) {
    return this.encrypt({ userID });
  }
  static getUserIDFromAccessToken(accessToken: string) {
    return this.decrypt(accessToken).then((decrypted: any) => decrypted.userID).catch(() => null);
  }
}
export class EncryptionHasher {
  static async hash(password: string) {
    const salt = await crypto.randomBytes(128).toString("base64");
    const iterations = 10000;
    const hash = await this.pbkdf2(password, salt, iterations).catch(
      (er) => null
    );
    if (!hash) throw new Error("Failed to hash password");
    return `${salt}:${iterations}:${hash.toString("base64")}`;
  }
  static async pbkdf2(password: string, salt: string, iterations: number) {
    return new Promise((res, rej) =>
      crypto.pbkdf2(password, salt, iterations, 512, "sha512", (er, hash) =>
        er ? rej(er) : res(hash)
      )
    ) as Promise<Buffer>;
  }
  static async verifyPassword(password: string, hash: string) {
    return new Promise((res, rej) => {
      const [salt, iterations, hash_] = hash.split(":");
      this.pbkdf2(password, salt, parseInt(iterations))
        .then((hashedPassword) => {
          res(hashedPassword.toString("base64") === hash_);
        })
        .catch((er) => rej(er));
    }) as Promise<boolean>;
  }
}
