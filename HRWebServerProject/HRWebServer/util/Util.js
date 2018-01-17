
const formatDate = (date) => {
    // var monthNames = [
    //     "January", "February", "March",
    //     "April", "May", "June", "July",
    //     "August", "September", "October",
    //     "November", "December"
    // ];

    // var monthNames = [
    //     "Tháng 1", "Tháng 2", "Tháng 3",
    //     "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7",
    //     "Tháng 8", "Tháng 9", "Tháng 10",
    //     "Tháng 11", "Tháng 12"
    // ];

    var day = date.getDate();
    // var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    // return day + ' ' + monthNames[monthIndex] + ' ' + year;
    return day + '-' + month + '-' + year;
}

const formatDateYYMMDD = (date) => {
    var day = date.getDate();
    // var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    // return day + ' ' + monthNames[monthIndex] + ' ' + year;
    return year + '-' + month + '-' + day;
}

const convertDateToCompare = (d) => {
    const date = new Date(formatDateYYMMDD(d));
    return date;
}

const splitStr = (str, option) => {
    return str.split(option);
}

const joinToStr = (strArr, option) => {
    return strArr.join(option);
}

const toLowerCase = () => {
    
}
module.exports = {
    formatDate,
    formatDateYYMMDD,
    convertDateToCompare,
    splitStr,
    joinToStr
}