var tableRoles;

document.addEventListener('DOMContentLoaded', function(){

    tableRoles = $('#tableRoles').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/roles/getRoles",
            "dataSrc":""
        },
        "columns":[ 
            {data: "id_roles"},
            {data: "name_role"},
            {data: "description_role"},
            {data: "role_status", 
            "searchable": false,
            "orderable":false,
            "render": function (data, type ,row) {
                if (row.role_status == 1) {
                    return '<span class="badge badge-success">Activo</span>';
                } else {
                    return '<span class="badge badge-danger">Inactivo</span>';
                }
            }
            },
            {data: "created_att"},
            {data: 0,"render": function (data ,type ,row) {
                return '<div class="text-center"><button class="btn btn-secondary btn-sm btnPermisosRole" onClick="btnPermisosRole('+row.id_roles+')" title="Permisos"><i class="fas fa-key"></i></button><button class="btn btn-primary btn-sm btnEditRole" onClick="ftnEditRol('+row.id_roles+')" title="Editar"><i class="fas fa-pencil-alt"></i></button><button class="btn btn-danger btn-sm btnDelRole" onClick="ftnDelRol('+row.id_roles+')" title="Eliminar"><i class="fas fa-trash-alt"></i></button></div>'
            }}
        ],
        "resonsieve":"true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0,"des"]]
        
    });

//nuevo rol
var formRole = document.querySelector("#formRole");
formRole.onsubmit = function(e){
    e.preventDefault();
    var id_roles = document.querySelector('#idRole').value;
    var name_role = document.querySelector('#name_role').value;
    var description_role = document.querySelector('#description_role').value;
    var role_status = document.querySelector('#role_status').value;

    if (name_role == '' || description_role == '' || role_status == '') 
    {
        swal("Atención", "Todos los campos son obligatorios.", "error");
        return false;
    }
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/roles/setRoles';
    var formData = new FormData(formRole);
    if(id_roles == ""){
        request.open("POST",ajaxUrl,true);
        request.send(formData);
    }else{
        var formDataJson = {"idRole":id_roles,"name_role":name_role,"description_role":description_role,"role_status":role_status};
        console.log(formDataJson);
        request.open("PUT",ajaxUrl,true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(formDataJson));
    }
    request.onreadystatechange = function () {
        
        if (request.readyState == 4 && request.status == 200) {
            
            var objData = JSON.parse(request.responseText);

            if (objData.status) 
            {
                $('#modalFormRole').modal("hide");
                formRole.reset();
                swal("Roles de usuario", objData.msg , "success");
                tableRoles.api().ajax.reload();
            }else{
                swal("Error", objData.msg , "error")
            }
        }
    }
}
});

$('#sampleTable').DataTable();

function openModal() {

    document.querySelector('#idRole').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Rol";
    document.querySelector('#updated_att').innerHTML = "";
    document.querySelector('#formRole').reset();

    $('#modalFormRole').modal('show');
}

window.addEventListener('load',function () {
    //ftnEditRol();
    //ftnDelRol();
}, false);
//eliminar role
function ftnEditRol(id_role) {

            document.querySelector('#titleModal').innerHTML = "Actualizar Rol";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";

            var id_roles = id_role;
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url+'/roles/getRole/'+id_roles;
            request.open("GET",ajaxUrl,true);
            request.send();

            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) 
                    {
                        document.querySelector("#idRole").value = objData.data.id_roles;
                        document.querySelector("#name_role").value = objData.data.name_role;
                        document.querySelector("#description_role").value = objData.data.description_role;

                        if (objData.data.role_status == 1) {
                            var optionSelect = '<option value="1" selected class="notBlock">Activo</option>';
                        } else {
                            var optionSelect = '<option value="2" selected class="notBlock">Inactivo</option>';
                        }

                        var htmlSelect = `${optionSelect}
                                        <option value="1">Activo</option>
                                        <option value="2">Inactivo</option>
                                        `;
                        
                        document.querySelector("#role_status").innerHTML = htmlSelect;
                        document.querySelector("#updated_att").innerHTML = "Ultima actualización: ".concat(objData.data.updated_att);
                        $('#modalFormRole').modal('show');
                    }else {
                        swal("Error", objData.msg , "error");
                    }
                }
            }

}
//eliminar role
function ftnDelRol(id_role) {
            var id_roles = id_role;

            swal({
                title: "Eliminar Rol",
                text: "¿Realmente quiere eliminar el rol?",
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
                    var ajaxUrl = base_url+'/roles/deleteRole/'+id_roles;
                    request.open("DELETE",ajaxUrl,true);
                    request.send();
                    request.onreadystatechange = function () {
                        var objData = JSON.parse(request.responseText);
                        if (objData.status) 
                        {
                            swal("Eliminar", objData.msg , "success");
                            tableRoles.api().ajax.reload();
                        }else{
                            swal("Atención", objData.msg , "error");
                        }
                    }
                }
            });
}

function btnPermisosRole(id_roles) {

    document.querySelector('#formPermits').reset();

    var id_role = id_roles;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/permits/getPermitsRol/'+id_role;
    request.open("GET",ajaxUrl,true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                $('#tablePermitsRoles > tbody').empty();              
                for (let i = 0; i < objData.data.length; i++) {
                    $('#tablePermitsRoles').append(
                        '<tr>'+
                            '<th>'+ objData.data[i].id_modules+'</th>'+
                            '<th>'+ objData.data[i].name_modules+'</th>'+
                            '<th>'+ objData.data[i].view_modules+'</th>'+
                            '<th>'+ objData.data[i].create_modules+'</th>'+
                            '<th>'+ objData.data[i].edit_modules+'</th>'+
                            '<th>'+ objData.data[i].delete_modules+'</th>'+
                        '</tr>'
                    )
                    
                }
                $('#modalFormPermits').modal('show');  
            } else {
                swal("Error", objData.msg , "error");
            }
            
        }
    }
    
}

