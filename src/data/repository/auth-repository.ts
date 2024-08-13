import authCacheDatasource from "@/data/datasource/cache/auth-cache-datasource";
import authRemoteDataSource from "@/data/datasource/remote/auth-remote-datasource";
import {User} from "@/domain/definition/entity/user.definition";

const saveTokenToCache = (accessToken: string) => {
    authCacheDatasource.saveToken(accessToken);
};

const getTokenFromCache = (): string | null => {
    return authCacheDatasource.loadToken();
};

const removeTokenFromCache = () => {
    authCacheDatasource.removeToken();
};

const getProfileFromCache = (): User | null => {
    return authCacheDatasource.loadProfile();
};

const deleteProfileFromCache = () => {
    return authCacheDatasource.removeProfile();
};

let saveProfileToCache = (user: User) => {
    authCacheDatasource.saveProfile(user);
}

const loginToRemote = async (username: string, password: string): Promise<User> => {
    return authRemoteDataSource.login(username, password);
}

const authRepository = {
    saveToken: saveTokenToCache,
    loadToken: getTokenFromCache,
    removeToken: removeTokenFromCache,
    login: loginToRemote,
    saveProfile: saveProfileToCache,
    loadProfile: getProfileFromCache,
    removeProfile: deleteProfileFromCache,
}

export default authRepository;
