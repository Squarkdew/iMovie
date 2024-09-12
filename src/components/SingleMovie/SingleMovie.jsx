import { useEffect, useState } from "react";
import cls from "./SingleMovie.module.scss";
import {
  Link,
  json,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { IoMdPlay } from "react-icons/io";
import axios from "axios";
import { LuStar } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import { formatDistanceToNow, parseISO } from "date-fns";
import { da, ru } from "date-fns/locale";
import { VscTrash } from "react-icons/vsc";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TfiPencil } from "react-icons/tfi";
import { CgFlagAlt } from "react-icons/cg";

import { useForm } from "react-hook-form";

function SingleMovie({
  closeMovie,
  playMovie,
  handleLikeMovie,
  favoritesMovies,
  handleDislikeMovie,
  userIsLogin,
  openPerson,
  userComments,
  getUserComments,
  handleClick,
  getUserInfo,
  isAdmin,
  userInfo,
  addRating,
  removeRating,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [movieActors, setMovieActors] = useState([]);
  const [currentMovie, setCurrentMovie] = useState({});
  const [showBtns, setShowBtns] = useState(false);
  const [show, setShow] = useState(false);
  const [showCommentOptions, setShowCommentOptions] = useState(null);
  const [showEditingCom, setShowEditingCom] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm();
  const commentValue = watch("comment", "");

  const [comments, setComments] = useState([]);

  const elem = document.getElementById("movieWindow");

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentMovie = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const { data } = await axios.post(
        "http://localhost:3001/getMovie/currentMovie",
        {
          token,
          movieId: id,
        }
      );

      setCurrentMovie(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [currentRating, setCurrentRating] = useState([]);
  const [userRate, setUserRate] = useState(null);

  const getCurrentRating = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const { data } = await axios.post("http://localhost:3001/rating/get", {
        token,
        movieId: id,
      });
      setCurrentRating(data.allRates);
      if (data.userRate !== undefined) {
        setUserRate(data.userRate.rating);
      } else {
        setUserRate(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeBackground = () => {
    if (elem.scrollTop >= 1) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }

    if (elem.scrollTop >= 370) {
      const imgElem = document.querySelector(`.${cls.showImg}`);
      if (imgElem) {
        imgElem.classList.add(cls.active);
      }
    } else {
      const imgElem = document.querySelector(`.${cls.showImg}`);
      if (imgElem) {
        imgElem.classList.remove(cls.active);
      }
    }
  };

  const addRate = async (el, cur) => {
    await addRating(el, cur);
    await getCurrentRating();
  };

  const deleteRate = async (movieId) => {
    await removeRating(movieId);
    await getCurrentRating();
  };

  const saveScroll = () => {
    sessionStorage.setItem("movieScroll", elem.scrollTop);
  };

  if (elem) {
    elem.addEventListener("scroll", changeBackground);
  }

  const getIsFavorite = () => {
    if (favoritesMovies.some((el) => el.id == currentMovie.id)) {
      setIsFavorite(true);
    } else setIsFavorite(false);
  };

  const ratingClass = colorRating(currentMovie.rating);

  function colorRating(rating) {
    if (rating >= 8) {
      return cls.active;
    } else if (rating >= 7) {
      return cls.highRating;
    } else if (rating >= 5) {
      return cls.mediumRating;
    } else {
      return cls.lowRating;
    }
  }

  const getMoviePersons = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const { data } = await axios.post(
        "http://localhost:3001/getMovie/persons",
        {
          token,
          movieId: id,
        }
      );

      if (data === false) {
        localStorage.setItem("token", JSON.stringify(""));
        userIsLogin();
      } else setMovieActors(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getComments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const { data } = await axios.post("http://localhost:3001/getComments", {
        token,
        movieId: id,
      });

      setComments(data);
      getUserComments();
    } catch (error) {
      console.log();
    }
  };

  const addComment = async (body) => {
    console.log(body);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token !== "") {
        await axios.post("http://localhost:3001/comments/add", {
          token,
          comment: body.comment,
          movieId: id,
        });

        await getComments();

        reset();
        setComment("");
      } else navigate("/auth");
    } catch (error) {
      console.log();
    }
  };

  const formatDate = (createdAt) => {
    let date = formatDistanceToNow(parseISO(createdAt), {
      addSuffix: true,
      locale: ru,
    });

    if (date.includes("около")) {
      date = date.slice(date.indexOf("о ") + 2);
      const parts = date.split(" ");
      const number = parts[0];
      const hour = parts[1];

      if (hour === "час" || hour === "часа" || hour === "часов") {
        if (number === "1" || number === "21") {
          date = `${number} час назад`;
        } else if (["2", "3", "4", "22", "23", "24"].includes(number)) {
          date = `${number} часа назад`;
        } else {
          date = `${number} часов назад`;
        }
      }
    }

    return date;
  };

  const deleteComment = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.post(
        "http://localhost:3001/comments/delete",
        { id, token }
      );
      if (data) {
        getComments();
        handleClick("Комментарии удален.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeComment = async (id) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001/comments/change",
        { id, comment: editingText }
      );
      if (data) {
        getComments();
        setShowEditingCom(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("movieScroll");

    if (elem && scrollPosition !== undefined) {
      elem.scrollTo({ top: scrollPosition });
    }
  }, [id, movieActors]);

  useEffect(() => {
    getIsFavorite();
  }, [favoritesMovies, currentMovie]);

  useEffect(() => {
    if (id) {
      getComments();
      getUserComments();
      getCurrentMovie();
      getCurrentRating();
    }
  }, [id]);

  useEffect(() => {
    if (currentMovie.persons) {
      getMoviePersons();
      getUserInfo();
    }
  }, [currentMovie]);

  const ratings = [
    { num: 1, color: "#ff0000" },
    { num: 2, color: "#ff0000" },
    { num: 3, color: "#ff0000" },
    { num: 4, color: "#ff0000" },
    { num: 5, color: "#777777" },
    { num: 6, color: "#777777" },
    { num: 7, color: "#3bb33b" },
    { num: 8, color: "#3bb33b" },
    { num: 9, color: "#3bb33b" },
    { num: 10, color: "#3bb33b" },
  ];
  const [hovered, setHovered] = useState(null);

  const [rate, setRate] = useState(0);

  const sumRate = () => {
    const newRating = currentRating.map((el) => el.rating);
    const sumRatings = newRating.reduce((acc, value) => acc + value, 0);
    const result = sumRatings / newRating.length;
    setRate(result);
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token")) !== "") {
      sumRate();
    }
  }, [currentRating, currentMovie]);

  const [rShow, setRShow] = useState(false);
  const showRatings = (tf) => {
    if (JSON.parse(localStorage.getItem("token")) !== "") {
      const elem = document.querySelector(`.${cls.ratingContainer}`);
      if (elem) {
        if (tf == false) {
          elem.classList.add(cls.active);
          setRShow(true);
        } else {
          elem.classList.remove(cls.active);
          setRShow(false);
        }
      }
    } else {
      navigate("/auth");
    }
  };

  const [chShow, setChShow] = useState(false);
  const showChange = () => {
    const elem = document.querySelector(`.${cls.ratingChange}`);
    if (elem) {
      if (chShow == false) {
        elem.classList.add(cls.active);
      } else {
        elem.classList.remove(cls.active);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className={cls.modalWindow}>
      {loading === true ? (
        <div className={cls.loading}>
          <div className={cls.spinner}></div>
        </div>
      ) : (
        <div className={cls.movieTop}>
          <div className={cls.backImg}>
            <img
              src={currentMovie.windowPoster}
              alt=""
              className={cls.poster}
            />
          </div>

          <div className={cls.trailerShadow}>
            <div
              className={cls.stickyHeader}
              style={{
                backgroundColor: showHeader ? "rgb(15, 15, 15)" : "",
              }}
            >
              <div className={`${cls.showTitle}`}>
                <img
                  src={currentMovie.pngTitle}
                  alt=""
                  className={cls.showImg}
                  onClick={() => elem.scrollTo({ top: 0, behavior: "smooth" })}
                />
              </div>
              <i
                className="fa-solid fa-xmark"
                id={cls.xBtn}
                onClick={closeMovie}
              ></i>
            </div>

            <div className={cls.movieStart}>
              <img src={currentMovie.pngTitle} alt="" className={cls.title} />
              <div className={cls.miniInfoTop}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className={`${cls.rating} ${ratingClass}`}>
                      <div>{currentMovie.rating}</div>
                    </div>
                    <span>{currentMovie.year},</span>
                    <span>
                      {currentMovie && currentMovie.genre
                        ? currentMovie.genre.split(", ").slice(0, 3).join(", ")
                        : ""}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <span>
                      {currentMovie && currentMovie.country
                        ? currentMovie.country.slice(
                            0,
                            currentMovie.country.indexOf(", ") + 1
                          )
                        : ""}
                    </span>
                    <span>{currentMovie.duration}</span>
                    <span>{currentMovie.age}</span>
                  </div>
                </div>
              </div>
              <div className={cls.movieBtns}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className={cls.play}
                    onClick={() => {
                      playMovie(currentMovie);
                      saveScroll();
                    }}
                  >
                    <IoMdPlay className={cls.playBtn} />
                    <h2>Смотреть</h2>
                  </div>
                  {!isFavorite ? (
                    <i
                      className="fa-regular fa-bookmark"
                      id={cls.favorites}
                      onClick={() => {
                        handleLikeMovie(currentMovie);
                        saveScroll();
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-bookmark"
                      id={cls.favorites}
                      onClick={() => handleDislikeMovie(currentMovie)}
                    ></i>
                  )}
                </div>
                <div className={cls.ratingContainer}>
                  <div className={cls.starContainer}>
                    {userRate === null ? (
                      <LuStar
                        className={cls.mainStar}
                        onClick={() => {
                          showRatings(rShow);
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: ratings.find((el) => el.num == userRate).color,
                          width: "50px",
                          height: "50px",
                        }}
                        onClick={() => {
                          setChShow(!chShow);
                          showChange();
                        }}
                      >
                        {userRate}
                      </span>
                    )}
                  </div>

                  <div className={cls.ratings}>
                    {currentRating && userInfo ? (
                      ratings.map((el, index) => {
                        return (
                          <span
                            className={cls.rating}
                            style={{
                              color:
                                hovered === index || userRate - 1 == index
                                  ? el.color
                                  : "#5f5f5f",
                              transform:
                                userRate - 1 == index || hovered === index
                                  ? "scale(1.3)"
                                  : "scale(1)",
                            }}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => {
                              addRate(el.num, currentMovie.id);
                              showRatings(true);
                            }}
                          >
                            {el.num}
                          </span>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                <div className={cls.ratingChange}>
                  <span
                    onClick={() => {
                      deleteRate(currentMovie.id);
                      setChShow(false);
                      showRatings(true);
                      showChange();
                    }}
                  >
                    Удалить оценку
                  </span>
                  <span
                    onClick={() => {
                      showRatings(false);
                      setChShow(false);
                      showChange();
                    }}
                  >
                    Изменить оценку
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={cls.information}>
            <div className={cls.miniInfo}>
              <div className={`${cls.rating} ${ratingClass}`}>
                <span>{currentMovie.rating}</span>
              </div>
              <div>
                <ul>
                  <li>{currentMovie.year},</li>
                  <li>
                    {currentMovie && currentMovie.genre
                      ? currentMovie.genre.split(", ").slice(0, 3).join(", ")
                      : ""}
                  </li>
                  <li>
                    {currentMovie &&
                    currentMovie.country &&
                    currentMovie.country.includes(", ")
                      ? currentMovie.country.slice(
                          0,
                          currentMovie.country.indexOf(", ")
                        )
                      : currentMovie.country}
                  </li>
                  <li>{currentMovie.duration}</li>
                  <li>{currentMovie.age}</li>
                </ul>
              </div>
            </div>
            <div className={cls.summary}>
              <p>{currentMovie.summary}</p>
            </div>
          </div>

          <div className={cls.lines}>
            <h2>Трейлеры</h2>
            <ul>
              {id && currentMovie.trailers && currentMovie.trailers !== {} ? (
                currentMovie.trailers.map((el, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      playMovie({ video: el.trailer, trailer: true })
                    }
                  >
                    <div>
                      <IoMdPlay className={cls.hoverPlayBtn} />
                      <img src={el.trailerPhoto} alt={el.title}></img>
                    </div>
                    <p>{el.title}</p>
                  </li>
                ))
              ) : (
                <p>No trailers available</p>
              )}
            </ul>
          </div>
          <div className={cls.actorsLine}>
            <h2>Актеры</h2>
            <div className={cls.actorsSlider}>
              {movieActors.map((el, index) => {
                const person = currentMovie?.persons?.find(
                  (person) => person.personId === el.id
                );
                const matchCategory = location.pathname.match(
                  /\/categories\/([^\/]+)/
                );
                const categoryId = matchCategory ? matchCategory[1] : null;
                let place = "/";
                if (location.pathname.includes("/personal")) {
                  place = `/personal/movies/${id}/${el.id}`;
                } else if (
                  location.pathname.includes(`/categories/${categoryId}/movies`)
                ) {
                  place = `/categories/${categoryId}/movies/${id}/${el.id}`;
                } else if (location.pathname.includes("/categories")) {
                  place = `/categories/movies/${id}/${el.id}`;
                } else if (location.pathname.includes("/comments")) {
                  place = `/comments/movies/${id}/${el.id}`;
                } else {
                  place = `/movies/${id}/${el.id}`;
                }
                return (
                  <Link
                    to={place}
                    onClick={saveScroll}
                    style={{ textDecoration: "none", color: "#fff" }}
                    className={cls.actor}
                    key={index}
                  >
                    <img src={el.photo} alt={el.name}></img>
                    <div className={cls.actorName}>
                      <h4 className={cls.name}>{el.name}</h4>
                      {person && (
                        <h4 className={cls.personName}>{person.nameInMovie}</h4>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className={cls.moreContainer}>
            <div className={cls.info}>
              <h2 className={cls.infoTitle}>О фильме</h2>
              <div className={cls.moreInfo}>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Рейтинг Кинопоиска</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.rating}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Рейтинг iMovie</div>
                  <div className={cls.valueInfo}>
                    <span>{rate > 0 ? rate : 0}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Год производства</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.year}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Страна</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.country}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Жанр</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.genre}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Бюджет</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.budget}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Сборы в США</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.usFees}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Сборы в мире</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.worldFees}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Премьера в мире</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.worldPremiere}</span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Возраст</div>
                  <div className={cls.valueInfo}>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "35px",
                        height: "28px",
                        border: "1px solid #fff",
                      }}
                    >
                      {currentMovie.age}
                    </span>
                  </div>
                </div>
                <div className={cls.moreInfoLine}>
                  <div className={cls.titleInfo}>Время</div>
                  <div className={cls.valueInfo}>
                    <span>{currentMovie.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={cls.actors}>
              <h4>В главных ролях</h4>
              <div>
                {movieActors.slice(0, 8).map((el) => {
                  const matchCategory = location.pathname.match(
                    /\/categories\/([^\/]+)/
                  );
                  const categoryId = matchCategory ? matchCategory[1] : null;
                  let place = "/";
                  if (location.pathname.includes("/personal")) {
                    place = `/personal/movies/${id}/${el.id}`;
                  } else if (
                    location.pathname.includes(
                      `/categories/${categoryId}/movies`
                    )
                  ) {
                    place = `/categories/${categoryId}/movies/${id}/${el.id}`;
                  } else if (location.pathname.includes("/categories")) {
                    place = `/categories/movies/${id}/${el.id}`;
                  } else if (location.pathname.includes("/comments")) {
                    place = `/comments/movies/${id}/${el.id}`;
                  } else {
                    place = `/movies/${id}/${el.id}`;
                  }
                  return (
                    <Link className={cls.actor} onClick={saveScroll} to={place}>
                      <div onClick={() => openPerson(el.id)}>{el.name}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ paddingBottom: "10px" }}>
            <div className={cls.addSection}>
              <div className={cls.user}>
                {userInfo.avatar && userInfo.avatar.length > 0 ? (
                  <img
                    src={userInfo.avatar}
                    alt=""
                    style={{ width: "46px", borderRadius: "50%" }}
                  />
                ) : (
                  <FaUser />
                )}
              </div>
              <form
                onSubmit={handleSubmit(addComment)}
                className={cls.inputSection}
              >
                <div className={cls.rowSection}>
                  <input
                    className={cls.input}
                    type="text"
                    placeholder="Введите комментарий"
                    autoComplete="off"
                    {...register("comment", { required: true })}
                    onFocus={() => setShowBtns(true)}
                    onBlur={() =>
                      commentValue.length === 0 && setShowBtns(false)
                    }
                  />
                </div>
                {showBtns ? (
                  <div className={cls.add}>
                    <div></div>
                    {commentValue.length > 0 ? (
                      <button
                        type="submit"
                        onClick={saveScroll}
                        style={{ color: "#000", cursor: "pointer" }}
                      >
                        Оставить комментарий
                      </button>
                    ) : (
                      <button
                        type="button"
                        style={{
                          backgroundColor: "hsla(0, 0%, 100%, 0.1)",
                        }}
                      >
                        Оставить комментарий
                      </button>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </form>
            </div>
            <div className={cls.comments}>
              {comments.length > 0 ? (
                comments
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((el, index) => {
                    const date = el.createdAt ? formatDate(el.createdAt) : "";

                    let isYour = userComments.some((com) => com.id === el.id);
                    if (isAdmin) {
                      isYour = true;
                    }
                    return (
                      <div key={comment.id} className={cls.comRow}>
                        <div className={cls.user}>
                          {el.avatar && el.avatar.length > 0 ? (
                            <img
                              src={el.avatar}
                              alt=""
                              style={{ width: "46px", borderRadius: "50%" }}
                            />
                          ) : (
                            <FaUser />
                          )}
                        </div>
                        <div className={cls.com}>
                          <div style={{ width: "100%" }}>
                            <div style={{ marginTop: "5px" }}>
                              <span className={cls.login}>{el.login}</span>
                              <span className={cls.date}>
                                {el.createdAt ? date : ""}
                              </span>
                            </div>
                            {showEditingCom === el.id ? (
                              <div>
                                <input
                                  value={editingText}
                                  className={cls.input}
                                  autoFocus
                                  onChange={(e) =>
                                    setEditingText(e.target.value)
                                  }
                                />
                                <div className={cls.add}>
                                  <button
                                    className={cls.cancel}
                                    onClick={() => setShowEditingCom(null)}
                                  >
                                    Отмена
                                  </button>
                                  {editingText.length > 0 ? (
                                    <button
                                      onClick={() => {
                                        saveScroll();
                                        changeComment(el.id);
                                      }}
                                      style={{
                                        color: "#000",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Изменить комментарий
                                    </button>
                                  ) : (
                                    <button
                                      style={{
                                        backgroundColor:
                                          "hsla(0, 0%, 100%, 0.1)",
                                      }}
                                    >
                                      Изменить комментарий
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className={cls.comment}>{el.comment}</div>
                            )}
                          </div>
                          {showEditingCom !== el.id ? (
                            <div className={cls.commentOptions}>
                              {showCommentOptions === index && (
                                <div
                                  className={cls.options}
                                  style={{
                                    marginTop: !isYour ? "0px" : "40px",
                                  }}
                                >
                                  {isYour ? (
                                    <div>
                                      <div
                                        className={cls.option}
                                        onClick={() => {
                                          deleteComment(el.id);
                                          setShowCommentOptions(null);
                                        }}
                                      >
                                        <span className={cls.optionText}>
                                          <VscTrash /> Удалить
                                        </span>
                                      </div>
                                      <div
                                        className={cls.option}
                                        onClick={() => {
                                          setShowEditingCom(el.id);
                                          setEditingText(el.comment);
                                          setShowCommentOptions(null);
                                        }}
                                      >
                                        <span className={cls.optionText}>
                                          <TfiPencil /> Изменить
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className={cls.flag}
                                      onClick={() => {
                                        setShowCommentOptions(null);
                                        handleClick("Жалоба отправлена");
                                      }}
                                    >
                                      <CgFlagAlt />
                                      Пожаловатся
                                    </div>
                                  )}
                                </div>
                              )}
                              <BsThreeDotsVertical
                                className={cls.dots}
                                onClick={() =>
                                  setShowCommentOptions(
                                    showCommentOptions === index ? null : index
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleMovie;
