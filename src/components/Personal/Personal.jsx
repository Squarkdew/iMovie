import React, { useEffect, useState } from "react";
import cls from "./Personal.module.scss";
import { IoBookmarkSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Personal({
  openMovie,
  favoritesMovies,
  favoritePersons,
  openPerson,
  getFavoritePersons,
  handleGetFavorites,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    getFavoritePersons();
    handleGetFavorites();
  }, []);

  return (
    <div className={cls.main}>
      {favoritePersons.length > 0 || favoritesMovies.length > 0 ? (
        <div className={cls.favoritesLine}>
          <div className={cls.line}>
            <h2>Буду смотреть</h2>
            <ul>
              {favoritesMovies &&
                favoritesMovies.map((el) => (
                  <li key={el.id} onClick={() => openMovie(el.id)}>
                    <div>
                      <img src={el.poster} alt="" className={cls.img} />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className={cls.line}>
            <h2>Любимые звезды</h2>
            <ul className={cls.personUl}>
              {favoritePersons &&
                favoritePersons.map((el) => (
                  <li
                    key={el.id}
                    className={cls.person}
                    onClick={() => openPerson(el.id)}
                  >
                    <img src={el.photo} alt="" className={cls.personImg} />
                    <div className={cls.info}>
                      <div className={cls.names}>
                        <div className={cls.name}>{el.name}</div>
                        <div className={cls.engName}>{el.engName}</div>
                      </div>
                      <div className={cls.career}>{el.career}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className={cls.toMainContainer}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "90px",
            }}
          >
            <div>
              <IoBookmarkSharp
                style={{ width: "60px", height: "60px", color: "grey" }}
              />
            </div>
            <div
              style={{
                width: "340px",
                fontSize: "22px",
                textAlign: "center",
                lineHeight: "30px",
                margin: "16px 0px 28px",
              }}
            >
              Сохраняйте интересные фильмы и сериалы, чтобы не потерять — они
              появятся в этом разделе
            </div>
            <div>
              <button className={cls.toHomeBtn} onClick={() => navigate("/")}>
                На главную
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Personal;
