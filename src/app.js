import Orders from '../data/orders.json';
import Users from '../data/users';
import Companies from '../data/companies';
import './styles/css/style.css';

let arrOrders = Orders.slice();
let userCompanyInfo = {company_id: null, birthday: null, title: null, industry: null, url: null};
let search = document.getElementById('search');
let table = document.getElementsByTagName('table')[0];
let tHead = table.children[0];
let tBody = table.children[1];
let tFooter = table.children[2];
let aboutUser = document.getElementById('aboutUser');
let noInfo = document.getElementById('noInfo');
let lastId = 0;
let ordersTotal = 0, ordersTotalMale = 0, ordersTotalFemale = 0, totalCheckMale = 0, totalCheckFemale = 0;
let totalArr = [];
let arrSearch = [];
let loadingKey = 0;

search.addEventListener("keyup", function () {
    arrSearch = [];
    let key = 0;
    ordersTotal = 0;
    ordersTotalMale = 0;
    ordersTotalFemale = 0;
    totalCheckMale = 0;
    totalCheckFemale = 0;
    let regPhrase = new RegExp(search.value, 'i');
    let flag = false;
    for (let i = 2; i < table.rows.length - 7; i++) {
        flag = false;
        for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            arrSearch[key] = table.rows[i].cells[3].textContent;
            key++;
            table.rows[i].style.display = "";
            ordersTotal += +table.rows[i].cells[3].textContent;
            if (table.rows[i].cells[1].textContent.substr(1, 1) === 'r') {
                ordersTotalMale++;
                totalCheckMale += +table.rows[i].cells[3].textContent
            } else {
                ordersTotalFemale++;
                totalCheckFemale += +table.rows[i].cells[3].textContent
            }
        } else {
            table.rows[i].style.display = "none";
        }
    }
    stat(arrSearch, arrSearch)
});

function timestamp(ordId) {
    let date = new Date(ordId * 1000);
    let years = date.getFullYear();
    let months = "0" + (date.getMonth() + 1);
    let days = "0" + date.getDate();
    let hours = "0" + date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();

    return (days.substr(-2) + '/' + months.substr(-2) + '/' + years + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
}

function userBirthday(ordId) {
    if (ordId !== null) {
        let date = new Date(ordId * 1000);
        let years = date.getFullYear();
        let months = "0" + (date.getMonth() + 1);
        let days = "0" + date.getDate();

        return (days.substr(-2) + '/' + months.substr(-2) + '/' + years);
    } else return 'No information'
}

function cardNum(num) {
    let numLen = num.length;
    let str = '';
    num.substr(0, 2);
    for (let i = 0; i < numLen - 6; i++) {
        str = str + '*'
    }
    return (num.substr(0, 2) + str + num.substr(numLen - 4, 4))
}

function userInfo(e) {
    let gender;
    if (Users[e].gender === "Male") {
        gender = 'Mr. '
    } else {
        gender = 'Ms. '
    }
    return ('<a>' + gender + ' ' + Users[e].first_name + ' ' + Users[e].last_name + '</a>')
}

function userCompany(user) {
    userCompanyInfo.company_id = user.company_id;
    userCompanyInfo.birthday = userBirthday(user.birthday);
    if (userCompanyInfo.company_id !== null) {
        userCompanyInfo.title = Companies[user.company_id - 1].title;
        userCompanyInfo.industry = Companies[user.company_id - 1].industry;
        userCompanyInfo.url = Companies[user.company_id - 1].url;
    } else {
        userCompanyInfo.title = 'No information';
        userCompanyInfo.industry = 'No information';
        userCompanyInfo.url = '#';
    }
}

function medianValue(c) {
    c.sort(function (a, b) {
        return a - b
    });
    if (c.length % 2 == 0) {
        return (+c[c.length / 2] + +c[c.length / 2 - 1]) / 2
    } else {
        return c[Math.ceil(c.length / 2) - 1]
    }
}

function stat(e, c) {
    if (e.length > 0) {
        tFooter.style.display = "";
        tFooter.innerHTML = '<tr><td colspan="7">' +
            '' +
            '</td></tr>' +
            '<tr class="secondTrStyle">' +
            '<td colspan="2">Orders Count</td>' +
            '<td colspan="5">' + e.length + '</td>' +
            '</tr>' +
            '<tr class="firstTrStyle">' +
            '<td colspan="2">Orders Total</td>' +
            '<td colspan="5">$ ' + ordersTotal.toFixed(2) + '</td>' +
            '</tr>' +
            '<tr class="secondTrStyle">' +
            '<td colspan="2">Median Value</td>' +
            '<td colspan="5">$ ' + medianValue(c) + '</td>' +
            '</tr >' +
            '<tr class="firstTrStyle">' +
            '<td colspan="2">Average Check</td>' +
            '<td colspan="5">$ ' + (ordersTotal / e.length).toFixed(2) + '</td>' +
            '</tr>' +
            '<tr class="secondTrStyle">' +
            '<td colspan="2">Average Check (Female)</td>' +
            '<td colspan="5">$ ' + (totalCheckFemale / ordersTotalFemale).toFixed(2) + '</td>' +
            '</tr>' +
            '<tr class="firstTrStyle">' +
            '<td colspan="2">Average Check (Male)</td>' +
            '<td colspan="5">$ ' + (totalCheckMale / ordersTotalMale).toFixed(2) + '</td>' +
            '</tr>'
    } else {
        tFooter.style.display = "none";
    }
}

document.onclick = function (e) {
    if (e.target.tagName === "A") {
        let user = Users[Orders[e.target.parentNode.parentNode.id.substr(6) - 1].user_id - 1];
        userCompany(user);
        if (!aboutUser.classList.contains("activeBlock")) {
            aboutUser.classList.add("activeBlock");
            aboutUser.innerHTML = '<div>' +
                '<button id="closeAboutUser">X</button>' +
                '<p>Birthday: ' + userCompanyInfo.birthday + '</p>' +
                '<p><img src="' + user.avatar + '" width="100px"></p>' +
                '<p>Company: <a href="' + userCompanyInfo.url + '" target="_blank"> ' + userCompanyInfo.title + ' </a></p>' +
                '<p>Industry: ' + userCompanyInfo.industry + '</p>' +
                '</div>';
            lastId = user.id;
        } else {
            if (user.id == lastId) {
                aboutUser.classList.remove("activeBlock")
            } else {
                lastId = user.id;
                aboutUser.classList.remove("activeBlock");
                setTimeout(function () {
                    userCompany(user);
                    aboutUser.classList.add("activeBlock");
                    aboutUser.innerHTML = '<div>' +
                        '<button id="closeAboutUser">X</button>' +
                        '<p>Birthday: ' + userCompanyInfo.birthday + '</p>' +
                        '<p><img src="' + user.avatar + '" width="100px"></p>' +
                        '<p>Company: <a href="' + userCompanyInfo.url + '" target="_blank"> ' + userCompanyInfo.title + ' </a></p>' +
                        '<p>Industry: ' + userCompanyInfo.industry + '</p>' +
                        '</div>'
                }, 500)
            }
        }
    } else {
        if (e.target.id === "closeAboutUser") {
            aboutUser.classList.remove("activeBlock")
        }
    }
    userCompanyInfo = {company_id: null, birthday: null, title: null, industry: null, url: null};
};

function tableLoading() {
    function triggerEvent(elem, event) {
        var clickEvent = new Event(event); // Create the event.
        elem.dispatchEvent(clickEvent);    // Dispatch the event.
    }

    if (arrOrders.length != 0) {
        ordersTotal = 0;
        ordersTotalMale = 0;
        ordersTotalFemale = 0;
        totalCheckMale = 0;
        totalCheckFemale = 0;
        for (let i = 0; i < arrOrders.length; i++) {
            totalArr[i] = arrOrders[i].total;
            ordersTotal += parseFloat(arrOrders[i].total);
            if (Users[arrOrders[i].user_id - 1].gender == 'Male') {
                ordersTotalMale++;
                totalCheckMale += parseFloat(arrOrders[i].total);
            } else {
                ordersTotalFemale++;
                totalCheckFemale += parseFloat(arrOrders[i].total);
            }
            let newRow = document.createElement('tr');
            if (i % 2) {
                newRow.classList.add('firstTrStyle')
            } else {
                newRow.classList.add('secondTrStyle')
            }
            newRow.setAttribute('id', 'order_' + arrOrders[i].id);
            newRow.innerHTML = '<td>' + arrOrders[i].transaction_id + '</td>' +
                '<td>' + userInfo(arrOrders[i].user_id - 1) + '</td>' +
                '<td>' + timestamp(arrOrders[i].created_at) + '</td>' +
                '<td>' + arrOrders[i].total + '</td>' +
                '<td>' + cardNum(arrOrders[i].card_number) + '</td>' +
                '<td>' + arrOrders[i].card_type + '</td>' +
                '<td>' + arrOrders[i].order_country + ' (' + arrOrders[i].order_ip + ')' + '</td>';
            tBody.appendChild(newRow);
        }
    } else {
        tBody.innerHTML = '<tr><td colspan="7" class="firstTrStyle">No information</td></tr>'
    }
    triggerEvent(search, 'keyup');
    if (loadingKey == 0) {
        stat(arrOrders, totalArr);
        loadingKey++
    }
}

window.onload = tableLoading();

tHead.onclick = function (e) {
    switch (e.target.id) {
        case 'column_1': {
            arrOrders.sort(function (a, b) {
                if (a.transaction_id < b.transaction_id)
                    return -1;
                if (a.transaction_id > b.transaction_id)
                    return 1;
                return 0;
            });
            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }
            tableLoading();
            break
        }
        case 'column_2': {
            arrOrders.sort(function (a, b) {
                let firstUser = Users[a.user_id - 1].first_name.concat(Users[a.user_id - 1].last_name);
                let secondUser = Users[b.user_id - 1].first_name.concat(Users[b.user_id - 1].last_name);
                if (firstUser < secondUser)
                    return -1;
                if (firstUser > secondUser)
                    return 1;
                return 0;
            });
            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }
            tableLoading();
            break
        }
        case 'column_3': {
            arrOrders.sort(function (a, b) {
                return a.created_at - b.created_at
            });
            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }
            tableLoading();
            break
        }
        case 'column_4': {
            arrOrders.sort(function (a, b) {
                return a.total - b.total
            });
            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }
            tableLoading();
            break
        }
        case 'column_6': {
            arrOrders.sort(function (a, b) {
                if (a.card_type < b.card_type)
                    return -1;
                if (a.card_type > b.card_type)
                    return 1;
                return 0;
            });
            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }
            tableLoading();
            break
        }
        case 'column_7': {
            arrOrders.sort(function (a, b) {
                let firstUser = a.order_country.concat(a.order_ip);
                let secondUser = b.order_country.concat(b.order_ip);
                if (firstUser < secondUser)
                    return -1;
                if (firstUser > secondUser)
                    return 1;
                return 0;
            });
            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }
            tableLoading();
            break
        }
    }
};