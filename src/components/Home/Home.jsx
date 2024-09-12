import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosInformationCircle } from "react-icons/io";

import cls from "./Home.module.scss";
import { Link } from "react-router-dom";
import { IoMdPlay } from "react-icons/io";

function Home({
  openMovie,
  movies,
  playMovie,
  favoritesMovies,
  handleLikeMovie,
  handleDislikeMovie,
}) {
  const [random, setRandom] = useState(7);

  const [isFavorite, setIsFavorite] = useState(false);

  const getIsFavorite = () => {
    if (
      movies &&
      movies[random] &&
      favoritesMovies.some((el) => el.id === movies[random].id)
    ) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  };

  useEffect(() => {
    getIsFavorite();
  }, [favoritesMovies, random]);

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
    const saveScroll = () => {
      const routeKey = window.location.pathname.replace(/\//g, "_");
      sessionStorage.setItem(`${routeKey}_scroll`, window.scrollY);
    };

    window.addEventListener("scroll", saveScroll);

    return () => {
      window.removeEventListener("scroll", saveScroll);
    };
  }, []);

  useEffect(() => {
    const routeKey = window.location.pathname.replace(/\//g, "_");
    const scrollPosition = sessionStorage.getItem(`${routeKey}_scroll`);
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }
  }, []);

  return (
    <div className={cls.main} id="home">
      {movies.length > 0 && (
        <div className={cls.randomMovie}>
          <div
            className={cls.randomImg}
            style={{
              backgroundImage: `url(${movies[random].windowPoster})`,
            }}
          ></div>
          <div className={cls.shadow}>
            <div className={cls.content}>
              <div>
                <img
                  src={movies[random].pngTitle}
                  alt=""
                  className={cls.pngTitle}
                />
              </div>
              <div className={cls.adapt}>
                <div className={cls.miniInfo}>
                  <div
                    className={`${cls.rating} ${colorRating(
                      movies[random].rating
                    )}`}
                  >
                    <span>{movies[random].rating}</span>
                  </div>
                  <div>
                    <ul>
                      <li>{movies[random].year},</li>
                      <li>
                        {movies[random] && movies[random].genre
                          ? movies[random].genre
                              .split(", ")
                              .slice(0, 2)
                              .join(", ")
                          : ""}
                      </li>
                      <li>
                        {movies[random] && movies[random].country
                          ? movies[random].country.slice(
                              0,
                              movies[random].country.indexOf(", ")
                            )
                          : ""}
                      </li>
                      <li>{movies[random].duration}</li>
                      <li className={cls.age}>{movies[random].age}</li>
                    </ul>
                  </div>
                </div>
                <div className={cls.miniSummary}>
                  <p>{movies[random].miniSummary}</p>
                </div>
                <div className={cls.movieBtns}>
                  <div
                    className={cls.play}
                    onClick={() => playMovie(movies[random])}
                  >
                    <IoMdPlay className={cls.playBtn} />
                    <h2>Смотреть</h2>
                  </div>

                  {!isFavorite ? (
                    <i
                      className="fa-regular fa-bookmark"
                      id={cls.favorites}
                      onClick={() => handleLikeMovie(movies[random])}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-bookmark"
                      id={cls.favorites}
                      onClick={() => handleDislikeMovie(movies[random])}
                    ></i>
                  )}
                  <div className={cls.about}>
                    <IoIosInformationCircle
                      className={cls.info}
                      onClick={() => openMovie(movies[random].id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={cls.lines}>
        <h2>Криминал</h2>
        <ul>
          {movies
            .filter((el) => el.genre.includes("криминал"))
            .map((el) => (
              <li key={el.id} onClick={() => openMovie(el.id)}>
                <div>
                  <img src={el.poster} alt="" className={cls.img} />
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className={cls.lines}>
        <h2>Фантастика</h2>
        <ul>
          {movies
            .filter((el) => el.genre.includes("фантастика"))
            .map((el) => (
              <li key={el.id} onClick={() => openMovie(el.id)}>
                <div>
                  <img src={el.poster} alt="" className={cls.img} />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
