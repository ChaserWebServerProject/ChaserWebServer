
function formatDate(date) {
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

function formatDateYYMMDD(date) {
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
    return year + '-' + month + '-' + day;
}

module.exports = { formatDate, formatDateYYMMDD }