import authRepository from "@/data/repository/auth-repository";

const execute = () => {
    authRepository.removeToken()
    authRepository.removeProfile()
}

const logoutUseCase = {
    execute
}

export default logoutUseCase
