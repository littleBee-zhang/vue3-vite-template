export const getUserInformation = () => {
    const userInfo = localStorage.getItem('userInfo')
    if(userInfo){
        return JSON.parse(userInfo)
    }
    return {}
}