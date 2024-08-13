import Cookies from "js-cookie";
import {User} from "@/domain/definition/entity/user.definition";

const saveToken = (accessToken: string) => {
    Cookies.set("access_token", JSON.stringify(accessToken), {expires: 7}); // Expires in 7 days
};

const loadToken = (): string | null => {
    const data = Cookies.get("access_token");
    return data ? JSON.parse(data) : null;
};

const removeToken = () => {
    Cookies.remove("access_token");
};

let saveProfile = (user: any) => {
    Cookies.set("profile", JSON.stringify(user), {expires: 7}); // Expires in 7 days
};

const loadProfile = (): User | null => {
    const data = Cookies.get("profile");
    return data ? JSON.parse(data) : null;
}

const removeProfile = () => {
    Cookies.remove("profile");
}

const authCacheDatasource = {
    saveToken,
    loadToken,
    removeToken,
    saveProfile,
    loadProfile,
    removeProfile,
};

export default authCacheDatasource;
