export const generateRandomColor = (index) => {
    if (index % 4 === 0) {
        return 'rgba(233, 106, 161, 1)'
    } else if (index % 4 === 1) {
        return 'rgba(76, 204, 148, 1)'
    } else if (index % 4 === 2) {
        return 'rgba(159, 144, 241, 1)'
    } else {
        return 'rgba(255, 196, 114, 1)'
    }
}

export const isPcBrowser = () => {
    let userAgentInfo = navigator.userAgent;
    const agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    let flag = true;
    for (let v = 0; v < agents.length; v++) {
        if (userAgentInfo.indexOf(agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}