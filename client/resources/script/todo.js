const BASE_URL = "http://localhost:3000"
function addTodo(e) {
    e.preventDefault()
    console.log('create new todo')
    $(".form-add-todo").modal("hide").unbind("submit");
    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/api/todos/`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            name: $('#name').val(),
            description: $('#description').val(),
            due: $('#due').val()
        }
    })

        .done(function (data) {
            console.log(data);
            $("#name").val("");
            $("#description").val("");
            $("#due").val("");
            hasLogin()
        })
        .fail(function (gg, textStatus) {
            console.log('Error :', textStatus);
        })

}

function showTodos() {
    console.log("showTodos");
    $("#table-todos").empty();

    $.ajax({
        method: "GET",
        url: `${BASE_URL}/api/todos`,
        headers: {
            token: localStorage.token,
        }
    })
        .done(response => {
            console.log(response, 'looping data todo');

            for (let i = 0; i < response.length; i++) {
                const localeDateString = new Date(response[i].due).toLocaleDateString();
                const tableData = `
            <tr id=${response[i]._id}">
              <td style="text-align: center;">${i + 1}</td>
              <td>${response[i].name}</td>
              <td style="word-break: break-word;">${response[i].description}</a></td>
              <td style="text-align: center;">${localeDateString}</td>
              <td style="text-align: center;"><a href="#" onclick="changeStatus('${response[i].status}', '${response[i]._id}', ${i + 1})" id="changeStatus${i + 1}">❌</td>
              <td style="text-align: center;"><a href="#" onclick="formUpdateTodo('${response[i].name}', '${response[i].description}', '${localeDateString}', '${response[i]._id}', '${response[i].status}')">📝</a></td>
              <td style="text-align: center;"><a href="#" onclick=deleteTodo('${response[i]._id}')>🗑️</a></td>
            </tr>
          `;

                const tableDataDone = `
            <tr id=${response[i]._id}>
              <td style="text-align: center;">${i + 1}</td>
              <td style="text-decoration: line-through; color: rgb(120, 120, 120);">${response[i].name}</td>
              <td style="word-break: break-word; text-decoration: line-through; color: rgb(120, 120, 120);">${response[i].description}</a></td>
              <td style="text-align: center; text-decoration: line-through; color: rgb(120, 120, 120);">${localeDateString}</td>
              <td style="text-align: center;"><a href="#" onclick="changeStatus('${response[i].status}', '${response[i]._id}', ${i + 1})" id="changeStatus${i + 1}">✔️</td>
              <td style="text-align: center;"><a href="#" onclick="formUpdateTodo('${response[i].name}', '${response[i].description}', '${localeDateString}', '${response[i]._id}', '${response[i].status}')">📝</a></td>
              <td style="text-align: center;"><a href="#" onclick=deleteTodo('${response[i]._id}')>🗑️</a></td>
            </tr>
          `;

                if (response[i].status === "Completed") {
                    $("#table-todos").append(tableDataDone);
                } else {
                    $("#table-todos").append(tableData);
                }
            }
        })

        .fail((jqXHR, textStatus) => {
            console.log(textStatus);
        });
}

function changeStatus(status, todoId, i) {
    console.log("change status")
    console.log(status, todoId, i);

    swal("Change curent status?", {
        buttons: ["Cancle", true],
    })
        .then(changeStatus => {
            if (changeStatus) {
                $.ajax({
                    method: "PATCH",
                    url: `${BASE_URL}/api/todos/${todoId}/status`,
                    data: { status },
                    headers: {
                        token: localStorage.token,
                    },
                })
                    .done(response => {
                        $("#table-todos").text("");
                        swal({
                            title: "Good job!",
                            text: "Update status succesfully",
                            icon: "success",
                            buttons: false,
                            timer: 2000
                        });
                        showTodos();
                    })

                    .fail((jqXHR, textStatus) => {
                        console.log(textStatus);

                        swal({
                            title: err.responseJSON.message,
                            icon: "error",
                        });
                    })

            }
        })
}

function deleteTodo(todoId) {
    console.log(todoId);
    console.log("deleteTodo");

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    method: "DELETE",
                    url: `${BASE_URL}/api/todos/${todoId}`,
                    headers: {
                        token: localStorage.token,
                    },
                })
                    .done(response => {
                        $("#table-todos").text("");
                        showTodos();
                    })

                    .fail((jqXHR, textStatus) => {
                        console.log(textStatus);

                        swal({
                            title: err.responseJSON.message,
                            icon: "error",
                        });
                    })

                swal("Task has been deleted", {
                    icon: "success",
                });
            }
        });
}

function formUpdateTodo(name, description, due, id, status) {

    console.log(name, description, due, id, status)

    localStorage.currentTodoId = id;
    localStorage.currentTaskStatus = status;

    let date = new Date(due)
    let newDate
    let month
    if (date.getDate() + 1 < 10) {
        newDate = '0' + (date.getDate() + 1)
    } else {
        newDate = date.getDate() + 1
    }
    if (date.getMonth() + 1 < 10) {
        month = '0' + (date.getMonth() + 1)
    } else {
        month = date.getMonth() + 1
    }
    date = `${date.getFullYear()}-${month}-${newDate}`

    console.log(date, 'dateeee')

    $("#update-todo-name").val(name);
    $("#update-todo-description").val(description);
    $("#update-todo-due-date").val(date);
    $("#form-update-todo").modal("show");
    $("#form-update-todo").submit(updateTodo);
}

function updateTodo(e) {
    e.preventDefault();

    console.log("updateTodo");

    $("#form-update-todo").modal("hide").unbind("submit");

    const updatedTodo = {
        name: $("#update-todo-name").val(),
        description: $("#update-todo-description").val(),
        status: localStorage.currentTaskStatus,
        due: $("#update-todo-due-date").val(),
    }

    console.log(updatedTodo);

    $.ajax({
        method: "PUT",
        url: `${BASE_URL}/api/todos/${localStorage.currentTodoId}`,
        data: updatedTodo,
        headers: {
            token: localStorage.token,
        },
    })
        .done(response => {
            console.log(response);
            $("#form-update-todo").modal("hide");
            $("#table-todos").text("");
            showTodos();
        })

        .fail((jqXHR, textStatus) => {
            console.log(textStatus);
            swal({
                title: err.responseJSON.message,
                icon: "error",
            });
        })
}