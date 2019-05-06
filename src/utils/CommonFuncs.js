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