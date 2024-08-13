import authRepository from "@/data/repository/auth-repository";
import {User} from "@/domain/definition/entity/user.definition";
import {NotFoundException} from "@/common/error/not-found-exception";

const execute = async (username: string, password: string): Promise<User> => {
    const user = await authRepository.login(username, password);
    if (user.access_token !== null) {
        authRepository.saveToken(user.access_token);
        authRepository.saveProfile(user);
    } else {
        throw new NotFoundException('User');
    }
    return user;
}

const loginUseCase = {
    execute
}

export default loginUseCase;
