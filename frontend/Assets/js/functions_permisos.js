var tablePermits;
//nuevo permiso
document.addEventListener('DOMContentLoaded', function(){

    tablePermits = $('#tablePermits').dataTable( {
        "aProcessing":true,
        "aServerSide":true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        "ajax":{
            "url": " "+base_url+"/permits/getPermits",
            "dataSrc":""
        },
        "columns":[ 
            {data: "id_modules"},
            {data: "name_modules"},
            {data: "name_role"},
            {data: "view_modules", 
            "searchable": false,
            "orderable":false,
            "render": function (data, type ,row) {
                if (row.view_modules == 1) {
                    return '<span class="align-bottom badge badge-pill badge-success"><i class="fas fa-check-circle"></i></span>';
                } else {
                    return '<span class="align-bottom badge badge-pill badge-danger"><i class="fas fa-times"></i></span>';
                }
            }
            },
            {data: "create_modules", 
            "searchable": false,
            "orderable":false,
            "render": function (data, type ,row) {
                if (row.create_modules == 1) {
                    return '<span class="align-bottom badge badge-pill badge-success"><i class="fas fa-check-circle"></i></span>';
                } else {
                    return '<span class="align-bottom badge badge-pill badge-danger"><i class="fas fa-times"></i></span>';
                }
            }
            },
            {data: "edit_modules", 
            "searchable": false,
            "orderable":false,
            "render": function (data, type ,row) {
                if (row.edit_modules == 1) {
                    return '<span class="align-bottom badge badge-pill badge-success"><i class="fas fa-check-circle"></i></span>';
                } else {
                    return '<span class="align-bottom badge badge-pill badge-danger"><i class="fas fa-times"></i></span>';
                }
            }
            },
            {data: "delete_modules", 
            "searchable": false,
            "orderable":false,
            "render": function (data, type ,row) {
                if (row.delete_modules == 1) {
                    return '<span class="align-bottom badge badge-pill badge-success"><i class="fas fa-check-circle"></i></span>';
                } else {
                    return '<span class="align-bottom badge badge-pill badge-danger"><i class="fas fa-times"></i></span>';
                }
            }
            },
            {data: "fechaCreacion"},
            {data: 0,"render": function (data ,type ,row) {
                return '<div class="text-center"><button class="btn btn-primary btn-sm btnEditRole" onClick="ftnEditPermit('+row.id_access_permits+')" title="Editar"><i class="fas fa-pencil-alt"></i></button><button class="btn btn-danger btn-sm btnDelRole" onClick="ftnDelPermit('+row.id_access_permits+')" title="Eliminar"><i class="fas fa-trash-alt"></i></button></div>'
            }}
        ],
        "resonsieve":"true",
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[3,"asc"]]
        
    });

    //Nuevo permiso
    var formPermit = document.querySelector("#formPermits");
    formPermit.onsubmit = function(e){
    e.preventDefault();
    var id_permits = document.querySelector('#idPermits').value;
    var modules = document.querySelector('#modules').value;
    var pk_fk_id_roles = document.querySelector('#pk_fk_id_roles').value;
    var view = document.querySelector('#view').checked;
    var create = document.querySelector('#create').checked;
    var edit = document.querySelector('#edit').checked;
    var delet = document.querySelector('#delete').checked;

    if (modules == '' || pk_fk_id_roles == '') 
    {
        swal("Atención", "Todos los campos son obligatorios.", "error");
        return false;
    }
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/permits/setPermit';
    var formData = new FormData(formPermit);

    if (id_permits == "") {
        var formDataJson = {"id_access_permits":id_permits,"fk_id_roles":pk_fk_id_roles,"fk_id_modules":modules,"view_modules":view,"create_modules":create,"edit_modules":edit,"delete_modules":delet};
        request.open("POST",ajaxUrl,true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(formDataJson));
    } else {
        var formDataJson = {"id_access_permits":id_permits,"fk_id_roles":pk_fk_id_roles,"fk_id_modules":modules,"view_modules":view,"create_modules":create,"edit_modules":edit,"delete_modules":delet};
        request.open("PUT",ajaxUrl,true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(formDataJson));
    }
        request.onreadystatechange = function () {
            
            if (request.readyState == 4 && request.status == 200) {
                    
                var objData = JSON.parse(request.responseText);
                if (objData.status) 
                {
                    $('#modalPermits').modal("hide");
                    formPermit.reset();
                    swal("Permmiso", objData.msg , "success");
                    tablePermits.api().ajax.reload();
                }else{
                    swal("Error", objData.msg , "error")
                }
            }
        }
    }
})



window.addEventListener('load', function () {
    ftnModules();
    ftnRolespermits();
},false);

//obtener modulos
function ftnModules() {
    var ajaxUrl = base_url+'/permits/getModules';
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open("GET",ajaxUrl,true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            var $select = $('#modules');
            $.each(objData,function (id_roles, name) {
                $select.append('<option value="'+name.id_modules+'">'+name.name_modules+'</option>');       
            });
            document.querySelector('#modules').value = 1;
            $('#modules').selectpicker('render');
        }
    }
}
//obtener roles
function ftnRolespermits() {
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

function ftnEditPermit(id_permits){

    document.querySelector('#titleModal').innerHTML = "Actualizar Permiso";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML = "Actualizar";

    var id_permit = id_permits
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url+'/permits/getPermit/'+id_permit;
    request.open("GET",ajaxUrl,true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                document.querySelector("#idPermits").value = objData.data.id_access_permits;
                document.querySelector("#modules").value = objData.data.fk_id_modules;
                $('#modules').selectpicker('render');
                document.querySelector("#pk_fk_id_roles").value = objData.data.fk_id_roles;
                $('#pk_fk_id_roles').selectpicker('render');
                var view = document.getElementById("view");
                if (objData.data.view_modules == 1) {
                    view.checked = true;
                } else {
                    view.checked = false;
                }
                var created = document.getElementById("create");
                if (objData.data.create_modules == 1) {
                    created.checked = true;
                } else {
                    created.checked = false;
                }
                var edit = document.getElementById("edit");
                if (objData.data.edit_modules == 1) {
                    edit.checked = true;
                } else {
                    edit.checked = false;
                }
                var deleted = document.getElementById("delete");
                if (objData.data.delete_modules == 1) {
                    deleted.checked = true;
                } else {
                    deleted.checked = false;
                }
                document.querySelector("#updated_att").innerHTML = "Ultima actualización: ".concat(objData.data.updated_att);
            }
            $('#modalPermits').modal('show');
        }
    }
}

function ftnDelPermit(id_permits) {
    var id_permits = id_permits;

    swal({
        title: "Eliminar Permiso",
        text: "¿Realmente quiere eliminar el permiso?",
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
            var ajaxUrl = base_url+'/permits/deletPermit/'+id_permits;
            request.open("DELETE",ajaxUrl,true);
            request.send();
            request.onreadystatechange = function () {
                var objData = JSON.parse(request.responseText);
                if (objData.status) 
                {
                    swal("Eliminar", objData.msg , "success");
                    tablePermits.api().ajax.reload();
                }else{
                    swal("Atención", objData.msg , "error");
                }
            }
        }
    });
}

function openModal() {

    document.querySelector('#idPermits').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Permiso";
    document.querySelector('#updated_att').innerHTML = "";
    document.querySelector('#formPermits').reset();

    $('#modalPermits').modal('show');
}