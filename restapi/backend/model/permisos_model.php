<?php

    class permisos_model extends mysql
    {
        //variables para mapeardatos
        private $idRole;
        private $idPermits;
        private $modules;
        private $pk_fk_id_roles;
        private $view;
        private $create;
        private $edit;
        private $delete;
        private $created_at;
        private $updated_at;

        public function __construct()
        {
            parent::__construct();
        }

        public function selectModules()
        {
            $sql = "SELECT * FROM modules WHERE status_module != 0";
            $request = $this->select_all($sql);
            return $request;
        }

        public function selectPermit(int $id_permit){
            $this->idPermits = $id_permit;
            $sql = "SELECT * FROM access_permits WHERE id_access_permits = $this->idPermits";
            $request = $this->select($sql);
            return $request;
        }

        public function selectPermits()
        {
            $sql = "SELECT ap.id_access_permits, m.id_modules,m.name_modules, r.name_role, ap.view_modules, ap.create_modules, ap.edit_modules, 
            ap.delete_modules,DATE_FORMAT(ap.created_att, '%d-%m-%Y') as fechaCreacion FROM access_permits ap INNER JOIN roles r ON ap.fk_id_roles = r.id_roles 
            INNER JOIN modules m ON ap.fk_id_modules = m.id_modules ORDER BY r.id_roles ASC";
            $request = $this->select_all($sql);
            return $request;
        }

        public function selecPermitRoles(int $id_role)
        {
            $this->idRole = $id_role;
            $sql = "SELECT m.id_modules,m.name_modules, ap.view_modules, ap.create_modules, ap.edit_modules, 
            ap.delete_modules FROM access_permits ap INNER JOIN roles r ON ap.fk_id_roles = r.id_roles 
            INNER JOIN modules m ON ap.fk_id_modules = m.id_modules WHERE ap.fk_id_roles =  $this->idRole";
            $request = $this->select_all($sql);
            return $request;
        }

        public function insertPermit(int $pk_fk_id_roles, int $modules, int $view, int $create,int $edit, int $delete, string $created_at, string $updated_at)
        {
            $this->pk_fk_id_roles = $pk_fk_id_roles;
            $this->modules = $modules;
            $this->view = $view;
            $this->create = $create;
            $this->edit = $edit;
            $this->delete = $delete;
            $this->created_at = $created_at;
            $this->updated_at = $updated_at;
            $return = 0;

            
            $sql = "SELECT * FROM access_permits WHERE fk_id_modules = $this->modules AND fk_id_roles = $this->pk_fk_id_roles";
            $request = $this->select_all($sql);
            if (empty($request)) {
                $query_insert = "INSERT INTO access_permits(fk_id_roles, fk_id_modules, view_modules, create_modules, edit_modules, delete_modules, created_att, updated_att) VALUES (?,?,?,?,?,?,?,?)";
                $arrData = array(
                    $this->pk_fk_id_roles,
                    $this->modules,
                    $this->view,
                    $this->create,
                    $this->edit,
                    $this->delete,
                    $this->created_at,
                    $this->updated_at
                );
                $request_insert = $this->insert($query_insert,$arrData);
                $return = $request_insert;
            }else{
                $return = 'exist';
            }
            return $return;
        }

        public function updatePermit(int $id_access_permits,int $pk_fk_id_roles, int $modules, int $view, int $create,int $edit, int $delete, string $updated_at)
        {
            $this->idPermits = $id_access_permits;
            $this->pk_fk_id_roles = $pk_fk_id_roles;
            $this->modules = $modules;
            $this->view = $view;
            $this->create = $create;
            $this->edit = $edit;
            $this->delete = $delete;
            $this->update = $updated_at;

            $sql = "SELECT * FROM access_permits WHERE fk_id_modules = $this->modules AND fk_id_roles != $this->pk_fk_id_roles";
            $request = $this->select_all($sql);

            if (empty($request)) {
                $query_update = "UPDATE access_permits SET fk_id_roles = ?, fk_id_modules = ?, view_modules = ?, create_modules = ?, edit_modules = ?, delete_modules = ?, updated_att = ? WHERE id_access_permits = $this->idPermits";
                $arrData = array($this->pk_fk_id_roles, $this->modules, $this->view, $this->create, $this->edit, $this->delete, $this->update);
                $request = $this->update($query_update,$arrData);
            } else {
                $request = "exist";
            }
            return $request;
        }

        public function deletePermit(int $id_access_permits)
        {
            $this->idPermits = $id_access_permits;
            $sql = "DELETE FROM access_permits WHERE id_access_permits = $this->idPermits";
            $request = $this->delete($sql);
            if ($request) 
                {
                    $request = 'ok';
                }else{
                    $request = 'error';
                }
            return $request;
        }

    }

?>