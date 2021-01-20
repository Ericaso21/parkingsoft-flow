<?php

    class users extends users_model
    {
        public function __construct()
        {
            $this->model = new users_model();
            parent::__construct();
        }

        public function setUsers(array $arrData)
        {
            if ($arrData) {
            if (empty($arrData['document_number']) || empty($arrData['pk_fk_id_document_type']) || empty($arrData['first_name']) || empty($arrData['second_name']) || empty($arrData['email']) || empty($arrData['roles_users_status'])) 
            {
                    $arrResponse = array('status' => false, 'msg' => 'Datos incorrectos.');
            } else {
                $id_user = strval($arrData['idUsers']);
                $document_number = strval($arrData['document_number']);
                $pk_fk_id_document_type = intval($arrData['pk_fk_id_document_type']);
                $first_name = ucwords(strval($arrData['first_name']));
                $second_name = ucwords(strval($arrData['second_name']));
                $surname = ucwords(strval($arrData['surname']));
                $second_surname = ucwords(strval($arrData['second_surname']));
                $genders = intval($arrData['genders']);
                $telephone = strval($arrData['telephone']);
                $pk_fk_id_roles = intval($arrData['pk_fk_id_roles']);
                $roles_users_status = intval($arrData['roles_users_status']);
                $email = strtolower(strval($arrData['email']));
                $password_user = hash("SHA256", $arrData['password_user']);
                $created_at = date("Y-m-d H:i:s");
                $updated_at = date("Y-m-d H:i:s");
                
                if ($id_user == 0) {
                    $option = 1;
                    $request_user = $this->model->insertUser(
                        $document_number,
                        $pk_fk_id_document_type,
                        $first_name,
                        $second_name,
                        $surname,
                        $second_surname,
                        $genders,
                        $telephone,
                        $pk_fk_id_roles,
                        $roles_users_status,
                        $email,
                        $password_user,
                        $created_at,
                        $updated_at
                    );
                } else {
                    $option = 2;
                    $password_user = empty($arrData[12]) ? "" : hash("SHA256", $arrData[12]);
                    $request_user = $this->model->updateUser(
                        $id_user,
                        $document_number,
                        $pk_fk_id_document_type,
                        $first_name,
                        $second_name,
                        $surname,
                        $second_surname,
                        $genders,
                        $telephone,
                        $pk_fk_id_roles,
                        $roles_users_status,
                        $email,
                        $password_user,
                        $updated_at
                    );
                }
                if (ctype_digit($request_user) or $request_user > 0) {
                    if ($option == 1) {
                        $arrResponse = array('status' => true, 'msg' => 'Datos guardados correctamente.');
                    } else {
                        $arrResponse = array('status' => true, 'msg' => 'Datos actualizados correctamente.');
                    }
                } elseif ($request_user == 'exist') {
                    $arrResponse = array('status' => false, 'msg' => '¡Atención! el email o la identificacion ya existen, ingrese otro.');
                } else {
                    $arrResponse = array('status' => false, 'msg' => 'No es posible almacenar los datos.');
                }
            }
                return $arrResponse;
            }
                die();
        }

        public function getUsers()
        {
            $arrData = $this->model->selectUsers();
            return $arrData;
            die();
        }

        public function getUser(string $document_number)
        {
            $id_user = strval($document_number);
            if (is_string($id_user)) {
                $arrData = $this->model->selectUser($id_user);
                if (empty($arrData)) {
                    $arrResponse = array('status' => false, 'msg' => 'Datos no encontrados.');
                } else {
                    $arrResponse = array('status' => true, 'data' => $arrData);
                }
                return $arrResponse;
            }
            die();
        }
        public function deleteUser(string $id_user)
        {
            if($id_user){
                $idUser = strval($id_user);
                $requestDelete = $this->delUser($idUser);
                if ($requestDelete) {
                    $arrResponse = array('status' => true, 'msg' => 'Se ha eliminado el usuario.');
                } else {
                    $arrResponse = array('status' => false, 'msg' => 'Error a el eliminar usuario.');
                }
                return $arrResponse;
            }
            die();
        }
}
    
?>