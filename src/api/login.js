import Axios from '../axios'
// 登录
export const login = (data) =>{
    return Axios.request({
        url: '/login',
        method: 'post',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
// 获取登录用户信息
export const getUserInfo = (data) =>{
    return Axios.request({
        url: '/api/user/username/' + data,
        method: 'get',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
// 修改密码
export const updateUserPwd = (data) =>{
    return Axios.request({
        url: '/api/user/updateUserPwd',
        method: 'post',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}