import Axios from '../axios'
const API = 'api/dataanalytics';
// 获取信息
export const getData = (data) => {
    return Axios.request({
        url: `/${API}/production`,
        method: 'post',
        data:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
};
// 获取信息
export const getList = (data) => {
    return Axios.request({
        url: `/${API}/data`,
        method: 'post',
        data:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
};
