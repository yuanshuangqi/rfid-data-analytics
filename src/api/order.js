import Axios from '../axios'
const API = 'api/order';
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