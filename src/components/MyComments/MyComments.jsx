import React, { useEffect, useState } from "react";
import cls from "./MyComments.module.scss";
import axios from "axios";
import { VscTrash } from "react-icons/vsc";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TfiPencil } from "react-icons/tfi";
import { formatDistanceToNow, parseISO } from "date-fns";
import { da, ru } from "date-fns/locale";
import { FaUser } from "react-icons/fa6";

function MyComments({
  userComments,
  getUserComments,
  userCommentsMovies,
  handleClick,
  userInfo,
  openMovie,
}) {
  const [showCommentOptions, setShowCommentOptions] = useState(null);
  const [showEditingCom, setShowEditingCom] = useState(null);
  const [editingText, setEditingText] = useState("");

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
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3001/comments/delete",
        { id, token }
      );
      if (data) {
        getUserComments();
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
        getUserComments();
        setShowEditingCom(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    getUserComments();
    console.log(userComments);
    console.log(userCommentsMovies);
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className={cls.main}>
      {userCommentsMovies &&
        userCommentsMovies.map((movie) => {
          let comments = userComments.filter((com) => com.movieId === movie.id);
          const ratingClass = colorRating(movie.rating);

          return (
            <div key={movie.id} className={cls.movie}>
              <div
                className={cls.movieInfo}
                onClick={() => openMovie(movie.id)}
              >
                <img src={movie.searchPoster} alt="" className={cls.poster} />
                <div className={cls.info}>
                  <h3>{movie.title}</h3>
                  <div>
                    <span className={`${cls.rating} ${ratingClass}`}>
                      {movie.rating}
                    </span>
                    <span>{movie.engTitle}</span>
                    {", "}
                    <span>{movie.year}</span>
                  </div>
                </div>
              </div>
              <div className={cls.comments}>
                {comments.length > 0 ? (
                  comments
                    .slice()
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((el, index) => {
                      const date = el.createdAt ? formatDate(el.createdAt) : "";

                      return (
                        <div key={index} className={cls.comRow}>
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
                          <div className={cls.com}>
                            <div style={{ width: "100%" }}>
                              <div style={{ marginTop: "5px" }}>
                                <span className={cls.login}>
                                  {userInfo.login}
                                </span>
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
                                        onClick={() => changeComment(el.id)}
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
                                {showCommentOptions === el.id && (
                                  <div
                                    className={cls.options}
                                    style={{
                                      marginTop: "40px",
                                    }}
                                  >
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
                                  </div>
                                )}
                                <BsThreeDotsVertical
                                  className={cls.dots}
                                  onClick={() =>
                                    setShowCommentOptions(
                                      showCommentOptions === el.id
                                        ? null
                                        : el.id
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
          );
        })}
    </div>
  );
}

export default MyComments;
