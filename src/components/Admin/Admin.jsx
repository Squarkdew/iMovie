import React from "react";
import cls from "./Admin.module.scss";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import AddMovie from "./AddMovie";
import AddPerson from "./AddPerson";
import Users from "./Users";

function Admin(props) {
  const navigate = useNavigate();
  return (
    <div className={cls.main}>
      <div className={cls.sidebar}>
        <div onClick={() => navigate("/")}>Назад</div>

        <NavLink
          to="/admin/addMovie"
          className={cls.link}
          style={({ isActive }) => ({
            backgroundColor: !isActive ? "#fff" : "#b5b5b5",
          })}
        >
          Добавить фильм
        </NavLink>
        <NavLink
          to="/admin/addPerson"
          className={cls.link}
          style={({ isActive }) => ({
            backgroundColor: !isActive ? "#fff" : "#b5b5b5",
          })}
        >
          Добавить персону
        </NavLink>
        <NavLink
          to="/admin/users"
          className={cls.link}
          style={({ isActive }) => ({
            backgroundColor: !isActive ? "#fff" : "#b5b5b5",
          })}
        >
          Фильмы
        </NavLink>
      </div>
      <div className={cls.content}>
        <Routes>
          <Route path="addMovie" element={<AddMovie />} />
          <Route path="addPerson" element={<AddPerson />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
