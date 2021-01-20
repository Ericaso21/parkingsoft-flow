var tableUsers;
document.addEventListener('DOMContentLoaded',function() {

    tableUsers = $('#tableUsers').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/users/getUsers",
            "dataSrc":""
        },
        "columns":[ 
            {data: "document_number"},
            {data: "document_type_acronym"},
            {data: "gender_acronym"},
            {data: "first_name"},
            {data: "surname"},
            {data: "email"},
            {data: "name_role"},
            {data: "roles_users_status", 
            "searchable": false,
            "orderable":false,
            "render": function (data, type ,row) {
                if (row.roles_users_status == 1) {
                    return '<span class="badge badge-success">Activo</span>';
                } else {
                    return '<span class="badge badge-danger">Inactivo</span>';
                }
            }
            },
            {data: "fechaCreacion"},
            {data: 0,"render": function (data ,type ,row) {
                return '<div class="text-center"><button class="btn btn-info btn-sm btnViewUsers" onClick="ftnViewUser('+row.document_number+')" title="Ver usuario"><i class="far fa-eye"></i></button><button class="btn btn-primary btn-sm btnEditUsers" onClick="ftnEditUser('+row.document_number+')" title="Editar"><i class="fas fa-pencil-alt"></i></button><button class="btn btn-danger btn-sm btnDelUser" onClick="ftnDelUser('+row.document_number+')" title="Eliminar"><i class="fas fa-trash-alt"></i></button></div>'
            }}
        ],
        "responsive": true,
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0,"des"]]
        
    });
    //nuevo usuario
    var formUsers = document.querySelector('#formUsers');
    formUsers.onsubmit = function(e) {
        e.preventDefault();
        var idUsers = document.querySelector('#idUsers').value;
        var document_number = document.querySelector('#document_number').value;
        var pk_fk_id_document_type = document.querySelector('#pk_fk_id_document_type').value;
        var first_name = document.querySelector('#first_name').value;
        var second_name = document.querySelector('#second_name').value;
        var surname = document.querySelector('#surname').value;
        var second_surname = document.querySelector('#second_surname').value;
        var genders = document.querySelector('#genders').value;
        var telephone = document.querySelector('#telephone').value;
        var pk_fk_id_roles = document.querySelector('#pk_fk_id_roles').value;
        var roles_users_status = document.querySelector('#roles_users_status').value;
        var email = document.querySelector('#email').value;
        var password_user = document.querySelector('#password_user').value;

        if(document_number == '' || pk_fk_id_document_type == '' || first_name == '' || surname == '' || email == '' || roles_users_status == '')
        {
            swal('Atención', "Todos los campos son obligatorios." , "error");
            return false;
        }

        var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        var ajaxUrl = base_url+'/users/setUsers';
        var formData = new FormData(formUsers);
        if (idUsers == '') {
            request.open("POST",ajaxUrl,true);
            request.send(formData);
        } else {
            var formDataJson = {"idUsers": idUsers,
            "document_number": document_number,
            "pk_fk_id_document_type": pk_fk_id_document_type,
            "first_name": first_name,
            "second_name": second_name,
            "surname": surname,
            "second_surname": second_surname,
            "genders": genders,
            "telephone": telephone,
            "pk_fk_id_roles": pk_fk_id_roles,
            "roles_users_status": roles_users_status,
            "email": email,
            "password_user": password_user}
            request.open("PUT",ajaxUrl,true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(JSON.stringify(formDataJson));
        }


        request.onreadystatechange = function(){
            if (request.readyState == 4 && request.status == 200) {
                var objData = JSON.parse(request.responseText);
                if (objData.status) {
                    $('#modalFormUsers').modal("hide");
                    formUsers.reset();
                    swal("Usuarios", objData.msg ,"success");
                    tableUsers.api().ajax.reload();
                }else{
                    swal('Error', objData.msg, "error");
                }
            }
        }
    }
}, false);

window.addEventListener('load', function () {
    ftnRolesUsers();
    //ftnViewUser();
    //ftnEditUser();
    //ftnDelUser();
},false);

function ftnRolesUsers() {
    var ajaxUrl = base_url+'/roles/getRoles';
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open("GET",ajaxUrl,true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            var $select = $('#pk_fk_id_roles');
            $.each(objData,function (id_roles, name) {
                $select.append('<option value="'+name.id_roles+'">'+name.name_role+'</option>');       
            });
            document.querySelector('#pk_fk_id_roles').value = 1;
            $('#pk_fk_id_roles').selectpicker('render');
        }
    }
}
//modal mostrar usuario
function ftnViewUser(id_user) {

            var idUser = id_user;
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/users/getUser/'+idUser;
            request.open("GET",ajaxUrl,true);
            request.send();
            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200){
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        var roles_users_status = objData.data.roles_users_status == 1 ?
                        '<span class="badge badge-success">Activo</span>' :
                        '<span class="badge badge-danger">Inactivo</span>';
                        document.querySelector('#celdocument_number').innerHTML = objData.data.document_number;
                        document.querySelector('#celdocument_type_acronym').innerHTML = objData.data.document_type_acronym;
                        document.querySelector('#celname_gender').innerHTML = objData.data.name_gender;
                        document.querySelector('#celfirst_name').innerHTML = objData.data.first_name.concat("   ",objData.data.second_name);
                        document.querySelector('#celsurname').innerHTML = objData.data.surname.concat("   ",objData.data.second_surname);
                        document.querySelector('#celemail').innerHTML = objData.data.email;
                        document.querySelector('#celname_role').innerHTML = objData.data.name_role;
                        document.querySelector('#celroles_users_status').innerHTML = roles_users_status;
                        document.querySelector('#celcreated_att').innerHTML = objData.data.fechaCreacion;
                        $('#modalViewUser').modal('show');
                    }else{
                        swal("Error", objData.msg ,"error");
                    }
                }
            }
}
//mostar modal actualizar
function ftnEditUser(id_user) {

            document.querySelector('#titleModal').innerHTML = "Actualizar Usuario";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";

            var idUser = id_user;
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/users/getUser/'+idUser;
            request.open("GET",ajaxUrl,true);
            request.send();
            request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                    var objData = JSON.parse(request.responseText);

                    if(objData.status){
                        document.querySelector('#idUsers').value = objData.data.document_number;
                        document.querySelector('#document_number').value = objData.data.document_number;
                        if (objData.data.pk_fk_id_document_type == 1) {
                            document.querySelector('#pk_fk_id_document_type').value = 1;
                        } else if(objData.data.pk_fk_id_document_type == 2) {
                            document.querySelector('#pk_fk_id_document_type').value = 2;
                        }else if(objData.data.pk_fk_id_document_type == 3){
                            document.querySelector('#pk_fk_id_document_type').value = 3;
                        }else{
                            document.querySelector('#pk_fk_id_document_type').value = 4;
                        }
                        $('#pk_fk_id_document_type').selectpicker('render');
                        document.querySelector('#first_name').value = objData.data.first_name;
                        document.querySelector('#second_name').value = objData.data.second_name;
                        document.querySelector('#surname').value = objData.data.surname;
                        document.querySelector('#second_surname').value = objData.data.second_surname;
                        if (objData.data.fk_id_gender == 1) {
                            document.querySelector('#genders').value = 1;
                        } else if(objData.data.fk_id_gender == 2){
                            document.querySelector('#genders').value = 2;
                        }else{
                            document.querySelector('#genders').value = 3;
                        }
                        $('#genders').selectpicker('render');
                        document.querySelector('#telephone').value = objData.data.telephone;
                        document.querySelector('#pk_fk_id_roles').value = objData.data.id_roles;
                        document.querySelector('#email').value = objData.data.email;
                        $('#pk_fk_id_roles').selectpicker('render');
                        if (objData.data.roles_users_status == 1) {
                            document.querySelector('#roles_users_status').value = 1;
                        } else {
                            document.querySelector('#roles_users_status').value = 2;
                        }
                        $('#roles_users_status').selectpicker('render');
                    }
                }
                $('#modalFormUsers').modal('show');
            }
}

//eliminar usuario
function ftnDelUser(id_user) {
            var id_roles = id_user;

            swal({
                title: "Eliminar Usuario",
                text: "¿Realmente quiere eliminar el usuario?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, eliminar!",
                cancelButtonText: "No, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function (isConfirm) {
                
                if (isConfirm) 
                {
                    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    var ajaxUrl = base_url+'/users/deletUser/'+id_roles;
                    var jsonData = {"idUser":id_roles};
                    request.open("DELETE",ajaxUrl,true);
                    request.setRequestHeader("Content-Type", "application/json");
                    request.send(JSON.stringify(jsonData));
                    request.onreadystatechange = function () {
                        var objData = JSON.parse(request.responseText);
                        if (objData.status) 
                        {
                            swal("Eliminar", objData.msg , "success");
                            tableUsers.api().ajax.reload();
                        }else{
                            swal("Atención", objData.msg , "error");
                        }
                    }
                }
            });
}

function openModal(){

    document.querySelector('#idUsers').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Usuario";
    document.querySelector('#updated_att').value ="";
    document.querySelector('#formUsers').reset();

    $('#modalFormUsers').modal('show');
}