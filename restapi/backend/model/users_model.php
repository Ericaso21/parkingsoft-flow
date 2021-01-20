<?php

    class users_model extends mysql
    {
        //variables para mapeardatos
        private $id_user;
        private $document_number;
        private $pk_fk_id_document_type;
        private $first_name;
        private $second_name;
        private $surname;
        private $second_surname;
        private $genders;
        private $telephone;
        private $pk_fk_id_roles;
        private $roles_users_status;
        private $email;
        private $password_user;
        private $created_at;
        private $updated_at;

        public function __construct()
        {
            parent::__construct();
        }

        public function selectUsers()
        {
            $sql = "SELECT u.document_number, tp.document_type_acronym, g.gender_acronym, u.first_name, u.surname,
            u.email, r.name_role, ru.roles_users_status,DATE_FORMAT(u.created_att, '%d-%m-%Y') as fechaCreacion FROM users u INNER JOIN roles_users ru ON u.document_number = ru.pk_fk_document_number
            INNER JOIN roles r ON ru.pk_fk_id_roles = r.id_roles INNER JOIN document_types tp ON u.pk_fk_id_document_type  = tp.id_document_type 
            INNER JOIN genders g ON u.fk_id_gender  = g.id_gender WHERE ru.roles_users_status != 0";
            $request = $this->select_all($sql);
            return $request;
        }

        public function selectUser(string $id_user)
        {
            $this->document_number = $id_user;
            $sql = "SELECT u.document_number, u.pk_fk_id_document_type, u.fk_id_gender, tp.document_type_acronym, g.name_gender, u.first_name,u.second_name, u.surname,u.second_surname,
            u.email, r.id_roles, r.name_role, u.telephone, ru.roles_users_status, DATE_FORMAT(u.created_att, '%d-%m-%Y') as fechaCreacion FROM users u INNER JOIN roles_users ru ON u.document_number = ru.pk_fk_document_number
            INNER JOIN roles r ON ru.pk_fk_id_roles = r.id_roles INNER JOIN document_types tp ON u.pk_fk_id_document_type  = tp.id_document_type 
            INNER JOIN genders g ON u.fk_id_gender  = g.id_gender WHERE u.document_number = '{$this->document_number}'";
            $request = $this->select($sql);
            return $request;
        }

        public function insertUser(string $document_number, int $pk_fk_id_document_type, string $first_name, string $second_name, string $surname, string $second_surname, int $genders, string $telephone, int $pk_fk_id_roles, int $roles_users_status, string $email, string $password_user, string $created_at, string $updated_at)
        {
            $this->document_number = $document_number;
            $this->pk_fk_id_document_type = $pk_fk_id_document_type;
            $this->first_name = $first_name;
            $this->second_name = $second_name;
            $this->surname = $surname;
            $this->second_surname = $second_surname;
            $this->genders = $genders;
            $this->telephone = $telephone;
            $this->pk_fk_id_roles = $pk_fk_id_roles;
            $this->roles_users_status = $roles_users_status;
            $this->email = $email;
            $this->password_user = $password_user;
            $this->created_at = $created_at;
            $this->updated_at = $updated_at;
            $return = 0;

            $sql = "SELECT * FROM users WHERE email = '{$this->email}' or  document_number = '{$this->document_number}'";
            $request = $this->select_all($sql);

            if (empty($request)) {
                $query_insert = "INSERT INTO users(document_number, pk_fk_id_document_type , fk_id_gender, first_name, second_name, surname, second_surname, telephone, email, password_user, created_att, updated_att ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                $arrData = array($this->document_number,
                                $this->pk_fk_id_document_type,
                                $this->genders,
                                $this->first_name,
                                $this->second_name,
                                $this->surname,
                                $this->second_surname,
                                $this->telephone,
                                $this->email,
                                $this->password_user,
                                $this->created_at,
                                $this->updated_at
                );
                $request_insert = $this->insert($query_insert, $arrData);
                if($request_insert == 0){
                    $query_insert_rol = "INSERT INTO roles_users (pk_fk_document_number, pk_fk_id_document_type, pk_fk_id_roles, roles_users_status, created_att, updated_att) VALUES (?,?,?,?,?,?)";
                    $arrData = array(
                        $this->document_number,
                        $this->pk_fk_id_document_type,
                        $this->pk_fk_id_roles,
                        $this->roles_users_status,
                        $this->created_at,
                        $this->updated_at
                    );
                    $request_insert_roles = $this->insert($query_insert_rol,$arrData);
                    $return = $request_insert_roles; 
                }
            }else{
                $return = 'exist';
            }
            return $return;


        }

        public function updateUser(string $id_user,string $document_number, int $pk_fk_id_document_type, string $first_name, string $second_name, string $surname, string $second_surname, int $genders, string $telephone, int $pk_fk_id_roles, int $roles_users_status, string $email, string $password_user, string $updated_at)
        {
            $this->id_user = $id_user;
            $this->document_number = $document_number;
            $this->pk_fk_id_document_type = $pk_fk_id_document_type;
            $this->first_name = $first_name;
            $this->second_name = $second_name;
            $this->surname = $surname;
            $this->second_surname = $second_surname;
            $this->genders = $genders;
            $this->telephone = $telephone;
            $this->pk_fk_id_roles = $pk_fk_id_roles;
            $this->roles_users_status = $roles_users_status;
            $this->email = $email;
            $this->password_user = $password_user;
            $this->updated_at = $updated_at;

            $sql = "SELECT * FROM users WHERE (email = '{$this->email}' AND document_number != '{$this->id_user}')
            OR (document_number = '{$this->document_number}' AND  document_number != '{$this->id_user}')";

            $request = $this->select_all($sql);
            if (empty($request)) {
                if($this->password_user != ""){
                    $sql = "UPDATE users SET document_number = ?, pk_fk_id_document_type  = ?, fk_id_gender = ?,
                    first_name = ?, second_name = ?, surname = ?, second_surname = ?, telephone = ?, email = ?, 
                    password_user = ?, updated_att = ? WHERE document_number = '{$this->id_user}'";
                    $arrData = array(
                        $this->document_number,
                        $this->pk_fk_id_document_type,
                        $this->genders,
                        $this->first_name,
                        $this->second_name,
                        $this->surname,
                        $this->second_surname,
                        $this->telephone,
                        $this->email,
                        $this->password_user,
                        $this->updated_at
                    );
                    $request = $this->update($sql,$arrData);
                    if ($request) {
                        $sql = "UPDATE roles_users SET pk_fk_document_number = ?, pk_fk_id_document_type = ?,
                        pk_fk_id_roles = ?, roles_users_status = ?, updated_att = ? WHERE pk_fk_document_number = '{$this->id_user}'";
                        $arrData =array(
                            $this->document_number,
                            $this->pk_fk_id_document_type,
                            $this->pk_fk_id_roles,
                            $this->roles_users_status,
                            $this->updated_at
                        );
                    }
                }else{
                    $sql = "UPDATE users SET document_number = ?, pk_fk_id_document_type  = ?, fk_id_gender = ?,
                    first_name = ?, second_name = ?, surname = ?, second_surname = ?, telephone = ?, email = ?, 
                    updated_att = ? WHERE document_number = '{$this->id_user}'";
                    $arrData = array(
                        $this->document_number,
                        $this->pk_fk_id_document_type,
                        $this->genders,
                        $this->first_name,
                        $this->second_name,
                        $this->surname,
                        $this->second_surname,
                        $this->telephone,
                        $this->email,
                        $this->updated_at
                    );
                    $request = $this->update($sql,$arrData);
                    if ($request) {
                        $sql = "UPDATE roles_users SET pk_fk_document_number = ?, pk_fk_id_document_type = ?,
                        pk_fk_id_roles = ?, roles_users_status = ?, updated_att = ? WHERE pk_fk_document_number = $this->id_user";
                        $arrData =array(
                            $this->document_number,
                            $this->pk_fk_id_document_type,
                            $this->pk_fk_id_roles,
                            $this->roles_users_status,
                            $this->updated_at
                        );
                    }
                }
                $request = $this->update($sql,$arrData);
            } else {
                $request = 'exist';
            }
            return $request;
            
        }

        public function delUser(string $id_user)
        {
            $this->id_user = $id_user;
            $sql = "UPDATE roles_users SET roles_users_status = ? WHERE pk_fk_document_number = '{$this->id_user}'";
            $arrData = array(0);
            $request = $this->update($sql,$arrData);
            return $request;
        }

    }

?>