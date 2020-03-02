import Axios from '../axios'
const API = 'api/bagging';
// 获取信息
export const getData = (data) => {
    return Axios.request({
        url: `/${API}/getList`,
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
        url: '/api/dictionary/' + data,
        method: 'get',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

// 导出信息
export const downloadData = (data) => {
    return Axios.request({
        url: `/${API}/downloadData`,
        method: 'post',
        data:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        responseType: 'blob'
    })
};
