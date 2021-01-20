<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


require '../vendor/autoload.php';
require '../../backend/helpers/helpers.php';
require '../../backend/config/config.php';
require '../../backend/libraries/core/conexion.php';
require '../../backend/libraries/core/mysql.php';
require '../../backend/model/roles_model.php';
require '../../backend/controller/roles.php';
require '../../backend/model/users_model.php';
require '../../backend/controller/users.php';
require '../../backend/model/permisos_model.php';
require '../../backend/controller/permisos.php';

$app = new \Slim\App([
    "settings"  => [
        "determineRouteBeforeAppMiddleware" => true,
    ]
]);

$app->add(function($request, $response, $next) {
    $route = $request->getAttribute("route");

    $methods = [];

    if (!empty($route)) {
        $pattern = $route->getPattern();

        foreach ($this->router->getRoutes() as $route) {
            if ($pattern === $route->getPattern()) {
                $methods = array_merge_recursive($methods, $route->getMethods());
            }
        }
        //Methods holds all of the HTTP Verbs that a particular route handles.
    } else {
        $methods[] = $request->getMethod();
    }

    $response = $next($request, $response);


    return $response->withHeader("Access-Control-Allow-Methods", implode(",", $methods));
});
//rutas
//==========================================================================
// API ROLES 
//==========================================================================
$app->group('/roles/',function (){

    $this->get('getRoles', function(Request $request, Response $response)
{
    $all_roles = new roles();
    $datos = $all_roles->getRoles();
    $newResponse = $response->withJson($datos,200);
    return $newResponse;
});

//get role
$this->get('getRole/{id}', function(Request $request, Response $response)
{
    $id_roles = $request->getAttribute('id');
    $getRole = new roles();
    $datos = $getRole->getRole($id_roles);
    $newResponse = $response->withJson($datos,200);
    return $newResponse;
});

//post cart_type insert new cars_type
$this->post('setRoles', function(Request $request, Response $response)
{
    $datos = $request->getParsedBody();
    
    if (empty($datos['idRole'])) {
        $roles = new roles();
        $array =  $roles->setRole($datos);
        $newResponse = $response->withJson($array,200);
        return $newResponse;
    } else {
        $data = array('status' => false, 'msg' => 'No puede insertar');
        $newResponse = $response->withJson($data, 401);
        return $newResponse;
    }
    die();
});
//put role
$this->map(['PUT','OPTIONS'],'setRoles', function(Request $request, Response $response)
{
    $datos = $request->getParsedBody();
    if (empty($datos['idRole'])) {
        $data = array('status' => false, 'msg' => 'No puede actualizar');
        $newResponse = $response->withJson($data, 401);
        return $newResponse;
    } else {
        $roles = new roles();
        $datos = $roles->setRole($datos);
        $newResponse = $response->withJson($datos,200);
        return $newResponse;
    }

});
//delete role
$this->map(["DELETE", "PATCH"],'deleteRole/{id}', function(Request $request, Response $response)
{
    $id_roles = $request->getAttribute('id');
    $getRole = new roles();
    $datos = $getRole->delRole($id_roles);
    $newResponse = $response->withJson($datos, 200);
    return $newResponse;
});

});
//==========================================================================
// API USERS
//==========================================================================
$app->group('/users/',function()
{
    //get user obtener todos los usuarios de base de datos y mostrar en datatable
    $this->get('getUsers',function(Request $request, Response $response)
    {
        $getUsers = new users();
        $datos = $getUsers->getUsers();
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
    //get user obtener solo un usuario y mostar en modal viewUser
    $this->get('getUser/{id}',function(Request $request, Response $response)
    {
        $document_number = $request->getAttribute('id');
        $getUser = new users();
        $datos = $getUser->getUser($document_number);
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
    //post user insertar usuario a base de datos
    $this->post('setUsers',function(Request $request, Response $response)
    {
        $datos = $request->getParsedBody();
        if (empty($datos['idUsers'])) {
            $setUser = new users();
            $datos = $setUser->setUsers($datos);
            $newResponse = $response->withJson($datos, 200);
            return $newResponse;
        } else {
            $data = array('status' => false, 'msg' => 'No puede insertar');
            $newResponse = $response->withJson($data, 401);
            return $newResponse;
        }
    });
    //put user actualizar usuario a base de datos
    $this->map(['PUT','OPTIONS'],'setUsers',function(Request $request, Response $response)
    {
        $datos = $request->getParsedBody();
        if (empty($datos['idUsers'])) {
            $data = array('status' => false, 'msg' => 'No puede insertar');
            $newResponse = $response->withJson($data, 401);
            return $newResponse;
        } else {
            $setUser = new users();
            $datos = $setUser->setUsers($datos);
            $newResponse = $response->withJson($datos, 200);
            return $newResponse;
        }
    });
    //delete user elii¿minar usuario base de datos
    $this->map(["DELETE", "PATCH"],'deletUser/{id}',function(Request $request, Response $response)
    {
        $idUser = $request->getAttribute('id');
        $delUser = new users();
        $datos = $delUser->deleteUser($idUser);
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
});
//==============================================================
//PERMISOS APIS
//===============================================================
$app->group('/permits/',function()
{
    // get permisos de cada rol
    $this->get('getPermitsRol/{id}',function(Request $request, Response $response)
    {
        $role_id = $request->getAttribute('id');
        $get_permitRol = new permisos();
        $datos = $get_permitRol->getPermitRoles($role_id);
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
    //get permisos obtener todos los permisos de base de datos y mostrar en datatable
    $this->get('getModules',function(Request $request, Response $response)
    {
        $getModules = new permisos();
        $datos = $getModules->getModules();
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
    //get permisos obtener todos los permisos de base de datos y mostrar en datatable
    $this->get('getPermits',function(Request $request, Response $response)
    {
        $getPermits = new permisos();
        $datos = $getPermits->getPermits();
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
    //get user obtener solo un usuario y mostar en modal viewUser
    $this->get('getPermit/{id}',function(Request $request, Response $response)
    {
        $permit_id = $request->getAttribute('id');
        $gePermit = new permisos();
        $datos = $gePermit->getPermit($permit_id);
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
    //post user insertar usuario a base de datos
    $this->post('setPermit',function(Request $request, Response $response)
    {
        $datos = $request->getParsedBody();
        if (empty($datos['id_access_permits'])) {
            $setUser = new permisos();
            $datos = $setUser->setPermisos($datos);
            $newResponse = $response->withJson($datos, 200);
            return $newResponse;
        } else {
            $data = array('status' => false, 'msg' => 'No puede insertar');
            $newResponse = $response->withJson($data, 401);
            return $newResponse;
        }
    });
    //put user actualizar usuario a base de datos
    $this->map(['PUT','OPTIONS'],'setPermit',function(Request $request, Response $response)
    {
        $datos = $request->getParsedBody();
        if (empty($datos['id_access_permits'])) {
            $data = array('status' => false, 'msg' => 'No puede insertar');
            $newResponse = $response->withJson($data, 401);
            return $newResponse;
        } else {
            $setUser = new permisos();
            $datos = $setUser->setPermisos($datos);
            $newResponse = $response->withJson($datos, 200);
            return $newResponse;
        }
    });
    //delete user elii¿minar usuario base de datos
    $this->map(["DELETE", "PATCH"],'deletPermit/{id}',function(Request $request, Response $response)
    {
        $idPermit = $request->getAttribute('id');
        $delPermit = new permisos();
        $datos = $delPermit->deletePermit($idPermit);
        $newResponse = $response->withJson($datos, 200);
        return $newResponse;
    });
});
// ========================================================================
// APIS AUTHENTICATION
//=========================================================================
$app->group('/authentication/',function()
{
    //user register
    $this->post('auth_register',function(Request $request, Response $response)
    {
        
    });
    //user login
    $this->post('auth',function(Request $request, Response $response)
    {
        
    });
});
$app->run();