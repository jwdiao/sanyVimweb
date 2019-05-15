import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Durian, isPcBrowser } from '../utils'
import { Toast } from 'antd-mobile';
import { message } from 'antd';

let alert = isPcBrowser() ? message.error : Toast.fail;

// 这个组件将根据登录的情况, 返回一个路由
export const PrivateRoute = ({component: Component, ...props}) => {
    // 解构赋值 将 props 里面的 component 赋值给 Component
    return <Route {...props} render={(p) => {
        const user = Durian.get('user');
        if (user && user.vendor){ // 如果登录并且选择了vendor, 返回正确的路由
            return <Component />
        } else { // 没有登录就重定向至登录页面
            alert("你还没有登录, 确认将跳转登录界面进行登录!")
            return <Redirect to={{
                pathname: '/',
                state: {
                    from: p.location.pathname
                }
            }}/>
        }
    }}/>
}