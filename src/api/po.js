import Axios from '../axios'
const API = 'api/po';
// 获取信息
export const getPOList = (data) => {
    return Axios.request({
        url: `/${API}/getPOList`,
        method: 'post',
        data:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
};
// 获取设备信息
export const getDictionaryInfo = (data) =>{
    return Axios.request({
        url: '/dictionary/' + data,
        method: 'get',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
