<?php

    class permisos extends permisos_model{

        public function __construct()
        {
            $this->model = new permisos_model();
            parent::__construct();
        }

        public function getPermitRoles(int $id_roles)
        {
            $id_role = intval(strClean($id_roles));
            if ($id_role > 0) {
                $arrData = $this->model->selecPermitRoles($id_role);
                if (empty($arrData)) {
                    $arrResponse = array('status' => false, 'msg' => 'Datos no encontrados.');
                } else {
                    $arrResponse = array('status' => true, 'data' => $arrData);
                }
                return $arrResponse;
            }
            die();
        }
        public function getModules()
        {
            $arrData = $this->model->selectModules();
            return $arrData;
            die();
        }

        public function getPermits()
        {
            $arrData = $this->model->selectPermits();
            return $arrData;
            die();
        }

        public function getPermit(int $idPermits){
            $id_permits = intval(strClean($idPermits));
            if ($id_permits > 0) {
                $arrData = $this->model->selectPermit($id_permits);
                if (empty($arrData)) {
                    $arrResponse = array('status' => false, 'msg' => 'Datos no encontrados.');
                } else {
                    $arrResponse = array('status' => true, 'data' => $arrData);
                }
                return $arrResponse;
            }
            die();
        }

        public function deletePermit(int $id_permit)
        {
            if ($id_permit) {
                $id_permits = intval(strClean($id_permit));
                $requestDelete = $this->model->deletePermit($id_permits);
                if ($requestDelete) {
                    $arrResponse = array('status' => true, 'msg' => 'Se ha eliminado el permiso exitosamente.');
                } else {
                    $arrResponse = array('status' => false, 'msg' => 'Error a el eliminar el permiso de usuario.');
                }
                return $arrResponse;
            }
        }

        public function setPermisos(array $datos)
        {
            if ($datos) {
                if (empty($datos['fk_id_modules']) || empty($datos['fk_id_roles'])) {
                    $arrResponse = array('status' => false, 'msg' => 'Datos incorrectos.');
                } else {
                    $idPermits = intval($datos['id_access_permits']);
                    $modules = intval($datos['fk_id_modules']);
                    $pk_fk_id_roles = intval($datos['fk_id_roles']);
                    if ($datos['view_modules'] == true) {
                        $view = 1;
                    } else {
                        $view = 2;
                    }
                    if ($datos['create_modules'] == true) {
                        $create = 1;
                    } else {
                        $create = 2;
                    }
                    if ($datos['edit_modules'] == true) {
                        $edit = 1;
                    } else {
                        $edit = 2;
                    }
                    if ($datos['delete_modules'] == true) {
                        $delete = 1;
                    } else {
                        $delete = 2;
                    }
                    $created_at = date("Y-m-d H:i:s");
                    $updated_at = date("Y-m-d H:i:s");
                    
                    if ($idPermits == 0) {
                        $option = 1;
                        $request_permits = $this->model->insertPermit(
                            $pk_fk_id_roles,
                            $modules,
                            $view,
                            $create,
                            $edit,
                            $delete,
                            $created_at,
                            $updated_at
                        );
                    } else {
                        $option = 2;
                        $request_permits = $this->model->updatePermit(
                            $idPermits,
                            $pk_fk_id_roles,
                            $modules,
                            $view,
                            $create,
                            $edit,
                            $delete,
                            $updated_at
                        );
                    }
                    if ($request_permits > 0) {
                        if($option == 1){
                            $arrResponse = array('status' => true, 'msg' => 'Datos guardados correctamente.');
                        }else{
                            $arrResponse = array('status' => true, 'msg' => 'Datos actualizados correctamente.');
                        }
                    } else if($request_permits == 'exist') {
                        $arrResponse = array('status' => false, 'msg' => '¡Atención! el permiso ya esta asociado a un modulo para el tipo de rol.');
                    } else {
                        $arrResponse = array('status' => false, 'msg' => 'No es posible almacenar los datos.');
                    }   
                }
                return $arrResponse;
            }
            die();
        }

    }

?>