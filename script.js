const config1 = {
    parent: "#usersTable",
    columns: [
        { title: "Ім’я", value: "name" },
        { title: "Прізвище", value: "surname" },
        { title: "Аватар", value: "avatar" },
        { title: "День народження", value: "birthday" },
        { title: "Дії", value: "actions" },
    ],
    apiUrl: "https://mock-api.shpp.me/lromanchenko/users",
};

function DataTable(config) {
    getNewData(config.apiUrl)
        .then((newData) => {
            console.log(newData);
            createTable(newData, config);
        })
        .catch((error) => console.log(error));
}

async function getNewData(url) {
    let response = await fetch(url);
    if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText));
    }
    let json = await response.json();
    return json.data;
}

function createTable(data, config) {
    let tableDiv = document.querySelector(config.parent);
    let table = document.createElement("table");
    table.id = "myTable";
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    tableDiv.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);

    createThead(thead, config);
    createTbody(tbody, data);
}

function createThead(thead, config) {
    let trInThead = document.createElement("tr");
    thead.appendChild(trInThead);

    for (let key of config.columns) {
        let th = document.createElement("th");
        let text = document.createTextNode(Object.values(key)[0]);
        th.appendChild(text);
        trInThead.appendChild(th);
    }
}

function createTbody(tbody, data) {
    let startIndex = Object.keys(data)[0];
    let endIndex = Object.keys(data)[0] + Object.keys(data).length + 1;

    for (let i = startIndex; i <= endIndex; i++) {
        let tr = document.createElement("tr");
        tr.id = i;
        tr.className = 'user';
        if (Object.keys(data).includes(tr.id)) {
            for (key in data[i]) {
                let td = document.createElement("td");
                let text = document.createTextNode(data[i][key]);
                td.appendChild(text);
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            tr.appendChild(createButtonDelete(i));
            tbody.appendChild(tr);
        }
    }
}

function createButtonDelete(id) {
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.type = "button";
    button.innerHTML = "Delete";
    button.className = "btn-styled";
    button.setAttribute("data-id", id);
    td.appendChild(button);
    button.onclick = function () {
        deleteUser(button.getAttribute("data-id"));
    };
    return td;
}

function deleteUser(id) {
    fetch(config1.apiUrl + "/" + id, {
        method: "DELETE",
    })
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            console.log("error", error);
        });
}

async function addNewUser() { 
    let newTr = document.createElement("tr");
    newTr.innerHTML = 
        '<td><input type="text" name="name" required></td>' +
        '<td><input type="text" name="surname" required></td>' +
        '<td><input type="text" name="avatar" required></td>' +
        '<td><input type="text" name="birthday" required></td>' +
        '<td><input id="addButton" type="submit" value="Add">';
    let referenceTr = document.querySelector('.user');
    referenceTr.parentNode.insertBefore(newTr, referenceTr);
    document.getElementById('addButton').addEventListener('click', (e) => {
        clickAddButton(e);
    });
}

function clickAddButton(e) { 
    let inputAll = document.querySelectorAll(`${config1.parent} input[required]`);
    let newUser = {
        [inputAll[0].name]: inputAll[0].value,
        [inputAll[1].name]: inputAll[1].value,
        [inputAll[2].name]: inputAll[2].value,
        [inputAll[3].name]: inputAll[3].value,
    }
    if (!checkValidInput(inputAll)) {
        addUser(newUser);
        e.preventDefault();
    } else { 
        inputAll.forEach(a => {
            if (a.value === '') { 
                a.className = 'red';
            }
        });
        alert('Fill in required fields');
        e.preventDefault();
    }
}

function checkValidInput(input) { 
    for (let i = 0; i < input.length; i++) {
        if (input[i].value === '') return true;
    }
    return false;
}

async function addUser(newUser) { 
    const rawResponse = await fetch(config1.apiUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    })
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            console.log("error", error);
        });
}

DataTable(config1);
