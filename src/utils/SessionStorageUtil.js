
let _sessionStorage = {
 
}
// 设置session storage
_sessionStorage.set = (key, info = {}) => {
    return sessionStorage.setItem(key, JSON.stringify(info))
}

// 获取session storage
_sessionStorage.get = (key) => {
    try {
         return JSON.parse(sessionStorage.getItem(key))
    }catch (e) {
        console.log('Get SessionStorage error!',e)
    }
    return false
}

// 删除某个session storage key
_sessionStorage.remove = (key) => {
    return sessionStorage.removeItem(key)
}

// 清除全部session storage
_sessionStorage.clear = () => {
    return sessionStorage.clear()
}

export const Durian = _sessionStorage;
