import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cls from "./SinglePerson.module.scss";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

function SinglePerson({ closeMovie, favoritePersons, getFavoritePersons }) {
  const { personId } = useParams();
  const [person, setPerson] = useState({});
  const [personMovies, setPersonMovies] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPerson = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(`http://localhost:3001/getMovie/person`, {
      token,
      personId,
    });
    setPerson(data);
  };

  const addPerson = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token !== "") {
        const { data } = await axios.post("http://localhost:3001/person/add", {
          token,
          id,
        });
        await getFavoritePersons();
      } else navigate("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  const deletePerson = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("http://localhost:3001/person/delete", {
        token,
        id,
      });
      await getFavoritePersons();
    } catch (error) {
      console.log(error);
    }
  };

  const elem = document.getElementById("movieWindow");

  const changeBackground = () => {
    if (elem.scrollTop >= 50) {
      const imgElem = document.querySelector(`.${cls.showName}`);
      if (imgElem) {
        imgElem.classList.add(cls.active);
      }
    } else {
      const imgElem = document.querySelector(`.${cls.showName}`);
      if (imgElem) {
        imgElem.classList.remove(cls.active);
      }
    }
  };

  const getPersonMovies = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3001/getPersonMovies",
        {
          token,
          personId: personId,
        }
      );
      setPersonMovies(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (elem) {
    elem.addEventListener("scroll", changeBackground);
  }

  let GoBack = function () {
    window.history.back();
  };

  useEffect(() => {
    getCurrentPerson();
    getPersonMovies();
    if (elem) {
      elem.scrollTo({ top: 0 });
    }
  }, [personId]);
  return (
    <div className={cls.main}>
      <div
        className={cls.stickyHeader}
        style={{
          backgroundColor: "rgb(15, 15, 15)",
        }}
      >
        <div className={cls.headerLeft}>
          {!location.pathname.includes("/person/") ? (
            <IoMdArrowBack onClick={GoBack} className={cls.back} />
          ) : (
            <div></div>
          )}

          <div
            className={cls.showTitle}
            style={
              location.pathname.includes("/person/")
                ? { marginLeft: "10px" }
                : { marginLeft: "0px" }
            }
          >
            <h1
              className={cls.showName}
              onClick={() => elem.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {person.name}
            </h1>
          </div>
        </div>
        <i className="fa-solid fa-xmark" id={cls.xBtn} onClick={closeMovie}></i>
      </div>
      <div className={cls.actor}>
        <div className={cls.mainInfo}>
          <div className={cls.actorImg}>
            <img src={person.photo} alt="" />
          </div>

          <div className={cls.actorInfo}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={cls.actorName}>
                <div>
                  <h1 className={cls.personName}>{person.name}</h1>
                  <div className={cls.engName}>{person.engName}</div>
                </div>
                {favoritePersons &&
                favoritePersons.some((el) => el.id === person.id) ? (
                  <div
                    className={cls.favoriteBtn}
                    onClick={() => deletePerson(person.id)}
                  >
                    <FaHeart className={cls.like} />
                    Любимая звезда
                  </div>
                ) : (
                  <div
                    className={cls.favoriteBtn}
                    onClick={() => addPerson(person.id)}
                  >
                    <FaRegHeart className={cls.like} />
                    Любимая звезда
                  </div>
                )}
              </div>
              {person.hasOscars > 0 ? (
                <div className={cls.oscar}>
                  <img src="http://localhost:3001/persons/oscar.png" alt="" />
                  <span>{person.hasOscars}</span>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            <div className={cls.about}>
              <div className={cls.adaptiveAbout}>
                <h2 className={cls.aboutPerson}>О персоне</h2>
                <div className={cls.table}>
                  <div className={cls.tableLine}>
                    <div className={cls.lineTitle}>Карьера:</div>
                    <div className={cls.lineValue}>{person.career}</div>
                  </div>
                  {person.height !== "" ? (
                    <div className={cls.tableLine}>
                      <div className={cls.lineTitle}>Рост:</div>
                      <div
                        className={cls.lineValue}
                        style={{ color: "#c5c5c5e6" }}
                      >
                        {person.height}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <div className={cls.tableLine}>
                    <div className={cls.lineTitle}>Дата рождения:</div>
                    <div className={cls.lineValue}>
                      {person &&
                        person.birthday &&
                        person.birthday.slice(0, person.birthday.indexOf("•"))}
                      <span
                        style={{
                          color: person.birthday === "—" ? "#fff" : "#c5c5c5e6",
                          marginLeft: person.birthday === "—" ? "0px" : "4px",
                        }}
                      >
                        {person &&
                          person.birthday &&
                          person.birthday.slice(
                            person.birthday.indexOf("•") - 1
                          )}
                      </span>
                    </div>
                  </div>
                  <div className={cls.tableLine}>
                    <div className={cls.lineTitle}>Место рождения:</div>
                    <div className={cls.lineValue}>{person.birthplace}</div>
                  </div>
                  <div className={cls.tableLine}>
                    <div className={cls.lineTitle}>Жанры:</div>
                    <div className={cls.lineValue}>{person.genres}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className={cls.bestMovies}>
                  <h2 className={cls.bestTitle}>Лучшие фильмы</h2>
                  <ul>
                    {personMovies !== [] ? (
                      personMovies.slice(0, 4).map((el, index) => {
                        return (
                          <Link
                            to={
                              location.pathname.includes("/personal")
                                ? `/personal/movies/${el.id}/`
                                : `/movies/${el.id}`
                            }
                            style={{ textDecoration: "none", color: "#fff" }}
                            onClick={() =>
                              sessionStorage.setItem("movieScroll", 0)
                            }
                            key={index}
                          >
                            <li key={index} className={cls.bestMovie}>
                              {el.title}
                            </li>
                          </Link>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cls.movies}>
          <h2>Фильмография</h2>
          <div className={cls.moviesSlider}>
            {personMovies !== [] ? (
              personMovies.map((el, index) => {
                const matchCategory = location.pathname.match(
                  /\/categories\/([^\/]+)/
                );
                const categoryId = matchCategory ? matchCategory[1] : null;
                let place = "/";
                if (location.pathname.includes("/personal")) {
                  place = `/personal/movies/${el.id}/`;
                } else if (
                  location.pathname.includes(
                    `/categories/${categoryId}/movies`
                  ) ||
                  location.pathname.includes(`/categories/${categoryId}/person`)
                ) {
                  place = `/categories/${categoryId}/movies/${el.id}/`;
                } else if (location.pathname.includes("/categories")) {
                  place = `/categories/movies/${el.id}/`;
                } else if (location.pathname.includes("/comments")) {
                  place = `/comments/movies/${el.id}/`;
                } else {
                  place = `/movies/${el.id}`;
                }
                return (
                  <div className={cls.movie}>
                    <Link
                      to={place}
                      style={{ textDecoration: "none", color: "#fff" }}
                      onClick={() => sessionStorage.setItem("movieScroll", 0)}
                      key={index}
                    >
                      <img
                        src={el.searchPoster}
                        className={cls.searchPoster}
                      ></img>
                      <div className={cls.movieInfo}>
                        <div className={cls.title}>{el.title}</div>
                        <div className={cls.info}>
                          {`${el.year}, ${el.genre.slice(
                            0,
                            el.genre.indexOf(", ")
                          )}`}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePerson;
