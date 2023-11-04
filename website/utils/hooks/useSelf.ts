import { useState, useEffect } from "react";
import { SelfUser } from "../types";
import { fetcher } from "../Fetcher";
import { apiDomain } from "../../constants";
import EventEmitter from "events";

export class SelfUserManager extends EventEmitter {
  user: SelfUser | null;
  cached: boolean;
  userFetchPromise: Promise<SelfUser | null> | null = null;
  static instance: SelfUserManager;
  static getInstance() {
    if (!SelfUserManager.instance)
      SelfUserManager.instance = new SelfUserManager();
    return SelfUserManager.instance;
  }
  constructor() {
    super();
    this.user = null;
    this.cached = false;
    if (typeof window !== "undefined") {
      this.user = JSON.parse(localStorage.getItem("user") ?? "null");
      this.cached = !!this.user;
      this.getUser(true);
    }
  }
  async getUser(fresh?: boolean) {
    if (this.user && !fresh) return this.user;
    if (this.userFetchPromise) return this.userFetchPromise;
    this.userFetchPromise = fetcher(`${apiDomain}/users/@me`).then((res) =>
      res.json()
    );
    const user = await this.userFetchPromise;
    this.user = user;
    this.userFetchPromise = null;
    this.cached = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      this.emit("user", user);
    }
    return user;
  }
}

export const useSelf = (u?: SelfUser) => {
  const [user, setUser] = useState(u ?? (null as SelfUser | null));
  useEffect(() => {
    const setuser = (u: SelfUser) => setUser(u);
    SelfUserManager.getInstance()
      .getUser()
      .then((u) => u && setuser(u));
    SelfUserManager.getInstance().on("user", setuser);
    return () => {
      SelfUserManager.getInstance().off("user", setuser);
    };
  }, []);
  return user;
};
