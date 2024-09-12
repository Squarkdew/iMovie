import React, { useEffect, useState } from "react";
import cls from "./Header.module.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { CgDatabase } from "react-icons/cg";
import { RiPencilFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { TbArrowsExchange } from "react-icons/tb";
import axios from "axios";
function Header({
  movies,
  openMovie,
  userIsLogin,
  persons,
  openPerson,
  isAdmin,
  getIsAdmin,
  userInfo,
  getUserInfo,
}) {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getUserInfo();
    document.addEventListener("mousedown", closeInfo);
    return () => {
      document.removeEventListener("mousedown", closeInfo);
    };
  }, []);

  function colorRating(rating) {
    if (rating >= 7) {
      return cls.highRating;
    } else if (rating >= 5) {
      return cls.mediumRating;
    } else {
      return cls.lowRating;
    }
  }

  const changeInput = () => {
    setIsInputOpen(!isInputOpen);
    setInputValue("");
  };

  const joinedArr = [...movies, ...persons];

  const text = inputValue ? inputValue.toLocaleLowerCase() : "";

  const startsWithText = joinedArr.filter((el) => {
    const title = el.title ? el.title.toLocaleLowerCase() : "";
    const engTitle = el.engTitle ? el.engTitle.toLocaleLowerCase() : "";
    const personName = el.name ? el.name.toLocaleLowerCase() : "";
    const personEngName = el.engName ? el.engName.toLocaleLowerCase() : "";

    return (
      title.startsWith(text) ||
      engTitle.startsWith(text) ||
      personName.startsWith(text) ||
      personEngName.startsWith(text)
    );
  });

  const includesText = joinedArr.filter((el) => {
    const title = el.title ? el.title.toLocaleLowerCase() : "";
    const engTitle = el.engTitle ? el.engTitle.toLocaleLowerCase() : "";
    const personName = el.name ? el.name.toLocaleLowerCase() : "";
    const personEngName = el.engName ? el.engName.toLocaleLowerCase() : "";

    return (
      (title.includes(text) ||
        engTitle.includes(text) ||
        personName.includes(text) ||
        personEngName.includes(text)) &&
      !(
        title.startsWith(text) ||
        engTitle.startsWith(text) ||
        personName.startsWith(text) ||
        personEngName.startsWith(text)
      )
    );
  });

  const inputSearchs = [...startsWithText, ...includesText];

  const del = () => {
    localStorage.setItem("token", "");
    document
      .querySelector(`.${cls.userContainer}`)
      .classList.remove(cls.active);
    getUserInfo();
    userIsLogin();
    getIsAdmin();
  };

  const closeInfo = (event) => {
    if (
      document.querySelector(`.App`) &&
      !document.querySelector(`.${cls.userContainer}`).contains(event.target)
    ) {
      document
        .querySelector(`.${cls.userContainer}`)
        .classList.remove(cls.active);
    }
  };

  const openInfo = () => {
    document.querySelector(`.${cls.userContainer}`).classList.add(cls.active);
  };

  const navigate = useNavigate();

  return (
    <div className={cls.header}>
      <div className={cls.nav}>
        <h1>iMovie</h1>

        <ul>
          <li>
            <NavLink
              exact
              to="/"
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#b5b5b5",
              })}
              onClick={() => (setIsInputOpen(false), setInputValue(""))}
            >
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#b5b5b5",
              })}
              onClick={() => (setIsInputOpen(false), setInputValue(""))}
            >
              Фильмы
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/series"
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#b5b5b5",
              })}
              onClick={() => (setIsInputOpen(false), setInputValue(""))}
            >
              Сериалы
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/personal"
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#b5b5b5",
              })}
              onClick={() => (setIsInputOpen(false), setInputValue(""))}
            >
              Мое
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={cls.icons}>
        <div className={cls.inputSection}>
          {!isInputOpen ? (
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={changeInput}
            ></i>
          ) : (
            <div className={cls.inputContainer}>
              <input
                type="text"
                spellcheck="false"
                placeholder="Фильмы и сериалы"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <i className="fa-solid fa-xmark" onClick={changeInput}></i>
            </div>
          )}
          {inputValue !== "" ? (
            <div className={cls.inputResults}>
              {inputValue === "" ? (
                <div></div>
              ) : inputSearchs.length > 0 ? (
                inputSearchs.map((el) => (
                  <div
                    className={cls.currentInputResult}
                    onClick={
                      el.title
                        ? () => openMovie(el.id)
                        : () => openPerson(el.id)
                    }
                  >
                    <img src={el.searchPoster || el.photo} alt="" />
                    <div className={cls.currentResultInfo}>
                      <p>{el.title || el.name}</p>
                      <div>
                        <span
                          className={`${cls.rating} ${colorRating(el.rating)}`}
                          style={
                            el.rating
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          {el.rating || <div></div>}
                        </span>
                        <span>
                          {el.engTitle || el.engName},{" "}
                          {el.year ||
                            (el.birthday !== "—"
                              ? el.birthday.match(/(\d{4})/)[0]
                              : "-")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={cls.notFound}>
                  По вашему запросу ничего не найдено
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div>
          {isAdmin ? (
            <div className={cls.adminIcon}>
              <Link to={"/admin/addMovie"}>
                <CgDatabase />
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className={cls.hoverContainer}>
          {localStorage.getItem("token").length > 0 ? (
            <div className={cls.userIcon} onClick={openInfo}>
              {userInfo && userInfo.avatar && userInfo.avatar.length > 0 ? (
                <img
                  src={userInfo.avatar}
                  alt=""
                  style={{
                    width: "46px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <FaUser />
              )}
            </div>
          ) : (
            <Link
              to={"/auth"}
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <div className={cls.login}>
                <div className={cls.userIcon}>
                  <FaUser />
                </div>
                <span>Войти</span>
              </div>
            </Link>
          )}

          <div className={cls.userContainer}>
            <div className={cls.user}>
              <span>{userInfo.login}</span>
              <div
                className={cls.hoverPen}
                onClick={() => navigate("/avatars")}
              >
                {userInfo && userInfo.avatar && userInfo.avatar.length > 0 ? (
                  <img
                    src={userInfo.avatar}
                    alt=""
                    style={{
                      width: "46px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <i className="fa-solid fa-user"></i>
                )}
                <RiPencilFill className={cls.penIcon} />
              </div>
            </div>
            <div className={cls.options}>
              <div
                onClick={(e) => {
                  navigate("/personal");
                  document
                    .querySelector(`.${cls.userContainer}`)
                    .classList.remove(cls.active);
                }}
              >
                Фильмы
              </div>
              <div
                onClick={(e) => {
                  navigate("/personal");
                  document
                    .querySelector(`.${cls.userContainer}`)
                    .classList.remove(cls.active);
                }}
              >
                Персоны
              </div>
              <div
                onClick={() => {
                  navigate("/comments");
                  document
                    .querySelector(`.${cls.userContainer}`)
                    .classList.remove(cls.active);
                }}
              >
                Комментарии
              </div>
            </div>
            <div
              className={cls.options}
              style={{ borderBottom: "1px solid hsla(0, 0%, 100%, 0.05)" }}
            >
              <div onClick={del}>Выйти</div>
            </div>
            <Link to={"/auth"} className={cls.changeLink}>
              <div className={cls.change}>
                <div className={cls.changeIcon}>
                  <TbArrowsExchange />
                </div>
                <span>Сменить аккаунт</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
