import * as axios from 'axios'
import { Toast } from 'antd-mobile';
import { message } from 'antd';
import { isPcBrowser } from './CommonFuncs'

let alert = isPcBrowser() ? message.error : Toast.fail;
axios.defaults.baseURL = 'http://10.19.8.21:9999'
// axios.defaults.baseURL = 'http://10.88.195.191:9999'

axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(config => {

    const token = sessionStorage.getItem('token');
    // 每次发送请求之前检测sessionStorage是否存有token,如果有则一并发给服务端
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
    // 后面增加错误页面提示
    console.log('axios rejected: ' + error)
    return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
    if (response.status >= 400 && response.status < 500) {
        window.location.href = decodeURI(`${window.location.protocol}//${window.location.host}/404.html`)
    }else {
        return response
    }
}, (error)=>{
    // 后面增加错误页面提示
    console.log('axios rejected: ' +error)
})

let _http = {
    get: null,
    post: null,
    all: null
}
_http.get = function (url, params = {}) {
    // 后面增加页面提示开始加载转框
    // console.log('axios Get method started: ' +url)
    return axios.get(url,{
        params: params,
        validateStatus: (status) => {
            return status >= 200 && status < 300
        }
    }).then(response=>{
        // 后面增加页面结束加载转框
        // console.log('axios Get method ended: ' +url)
        // 获取接口自定义Code
        let code = response.data.ret
        // 获取接口返回message
        let message = response.data.msg
        // 对于接口定义的特殊范围的 code，统一对返回的 message 作弹框处理
        if (code === '201') {
            // 后面增加具体报错信息提示
            console.log('axios Get method error code: ' +url+', error code: '+code);
            alert(message, 1);
            return null;
        }
        return response.data
    }).catch(error=>{
        // 后面增加页面报错提示
        console.log('axios Get method exception: ' +url+', error: '+error)
    })
}

_http.post = function (url, params = {}) {
    // 后面增加页面提示开始加载转框
    // console.log('axios Post method started: ' +url)
    return axios.post(url,params)
        .then(response=>{
            // 后面增加页面结束加载转框
            // console.log('axios Post method ended: ' +url)
            // 获取接口自定义Code
            let code = response.data.ret
            // 获取接口返回message
            let message = response.data.msg
            // 对于接口定义的特殊范围的 code，统一对返回的 message 作弹框处理
            if (code === '201') {
            // 后面增加具体报错信息提示
                console.log('axios Get method error code: ' +url+', error code: '+code);
                alert(message, 1);
                return null;
            }
            return response.data
        }).catch(error=>{
            // 后面增加页面报错提示
            console.log('axios Post method exception: ' +url+', error: '+error)
        })
}

_http.all = function (requests = []) {
    // 后面增加页面提示开始加载转框
    // console.log('axios asyncAll method started: ' +requests)
    return axios.all(requests).then(resultArr => {
        // 后面增加页面结束加载转框
        // console.log('axios asyncAll method ended')
        for (let result of resultArr) {
            let code = result.code
            // 对于接口定义的特殊范围的 code，统一对返回的 message 作弹框处理
            if (code > 220 || code < 200) {
                // 后面增加具体报错信息提示
                console.log('axios asyncAll method error code: '+code)
            }
        }
        //  返回每个方法返回的接口数据
        return resultArr
    }).catch(error=>{
        // 后面增加页面报错提示
        console.log('axios asyncAll method exception error: '+error)
    })
}

export const http = _http;