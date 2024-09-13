import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Home from "./components/Home/Home";
import Header from "./components/Header/HeaderNav";
import { useEffect, useState } from "react";
import SingleMovie from "./components/SingleMovie/SingleMovie.jsx";
import axios from "axios";
import MoviePlayer from "./components/MoviePlayer/MoviePlayer";
import Personal from "./components/Personal/Personal";
import Auth from "./components/Auth/Auth";
import SinglePerson from "./components/SinglePerson/SinglePerson";
import Admin from "./components/Admin/Admin";
import addMovie from "./components/Admin/AddMovie";
import AddPerson from "./components/Admin/AddPerson";
import Users from "./components/Admin/Users";
import Footer from "./components/Footer/Footer";
import { MdOutlineHome } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { MdOutlineBookmarks } from "react-icons/md";
import { MdBookmarks } from "react-icons/md";
import { MdOutlineRectangle } from "react-icons/md";
import { MdRectangle } from "react-icons/md";
import Categories from "./components/MoviesCategories/Categories";
import SingleCategory from "./components/SingleCategory/SingleCategory";
import Avatars from "./components/Avatars/Avatars";
import MyComments from "./components/MyComments/MyComments";

function App() {
  const [movies, setMovies] = useState([]);
  const [persons, setPersons] = useState([]);
  const [moviePlayer, setMoviePlayer] = useState({});
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isTrailerPlay, setIsTrailerPlay] = useState(false);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [favoritesMovies, setFavoritesMovies] = useState([]);
  const [favoritePersons, setFavoritePersons] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [userCommentsMovies, setUserCommentsMovies] = useState([]);
  const [currentMovieRating, setCurrentMovieRating] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const playMovie = (movie) => {
    if (movie.trailer) {
      setIsPlayerOpen(!isPlayerOpen);
      setMoviePlayer(movie);
    } else {
      if (localStorage.getItem("token") !== "") {
        setIsPlayerOpen(!isPlayerOpen);
        setMoviePlayer(movie);
      } else navigate("auth");
    }
  };
  const openMovie = (id) => {
    const matchCategory = location.pathname.match(/\/categories\/([^\/]+)/);
    const categoryId = matchCategory ? matchCategory[1] : null;
    document.body.style.overflow = "hidden";
    document.querySelector(".movie").classList.add("active");
    document.querySelector(".backShadow").classList.add("active");
    document.querySelector(".movieWindow").style.overflow = "scroll";
    setIsTrailerPlay(true);
    if (location.pathname === "/") {
      navigate(`/movies/${id}`);
    } else if (location.pathname === "/personal") {
      navigate(`/personal/movies/${id}`);
    } else if (location.pathname === "/categories") {
      navigate(`/categories/movies/${id}`);
    } else if (location.pathname.includes("/categories/")) {
      navigate(`/categories/${categoryId}/movies/${id}`);
    } else if (location.pathname.includes("/comments")) {
      navigate(`/comments/movies/${id}`);
    }
  };

  const openPerson = (id) => {
    const matchCategory = location.pathname.match(/\/categories\/([^\/]+)/);
    const categoryId = matchCategory ? matchCategory[1] : null;
    document.body.style.overflow = "hidden";
    document.querySelector(".movie").classList.add("active");
    document.querySelector(".backShadow").classList.add("active");
    document.querySelector(".movieWindow").style.overflow = "scroll";
    if (location.pathname === "/") {
      navigate(`/person/${id}`);
    } else if (location.pathname === "/personal") {
      navigate(`/personal/person/${id}`);
    } else if (location.pathname === "/categories") {
      navigate(`/categories/person/${id}`);
    } else if (location.pathname.includes("/categories/")) {
      navigate(`/categories/${categoryId}/person/${id}`);
    } else if (location.pathname.includes("/comments")) {
      navigate(`/comments/person/${id}`);
    }
  };
  const closeMovie = () => {
    const matchCategory = location.pathname.match(/\/categories\/([^\/]+)/);
    const categoryId = matchCategory ? matchCategory[1] : null;
    document.body.style.overflow = "scroll";
    document.querySelector(".movie").classList.remove("active");
    document.querySelector(".backShadow").classList.remove("active");
    document
      .getElementById("movieWindow")
      .scrollTo({ top: 0, behavior: "smooth" });
    sessionStorage.setItem("movieScroll", 0);

    setTimeout(() => {
      if (location.pathname.includes("/personal")) {
        navigate("/personal");
      } else if (
        location.pathname.includes("/categories/movies/") ||
        location.pathname.includes("/categories/person/")
      ) {
        navigate("/categories");
      } else if (location.pathname.includes(`/categories/${categoryId}`)) {
        navigate(`/categories/${categoryId}`);
      } else if (location.pathname.includes(`/comments`)) {
        navigate(`/comments`);
      } else {
        navigate("/");
      }
    }, 100);
  };

  const getMovies = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post("http://localhost:3001/getMovies", {
        token,
      });

      if (data === false) {
        localStorage.setItem("token", "");
        userIsLogin();
      } else setMovies(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getPersons = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post("http://localhost:3001/getPersons", {
        token,
      });

      if (data === false) {
        localStorage.setItem("token", "");
        userIsLogin();
      } else setPersons(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLikeMovie = async (movie) => {
    try {
      const token = localStorage.getItem("token");
      if (token !== "") {
        const { data } = await axios.post(
          `http://localhost:3001/favorites/add`,
          {
            token,
            currentMovie: movie,
          }
        );

        await handleGetFavorites();
      } else navigate("/auth");
    } catch (e) {
      console.error(e);
    }
  };

  const getFavoritePersons = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`http://localhost:3001/person/get`, {
        token,
      });
      if (data !== null) {
        setFavoritePersons(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:3001/getFavoritesMovies",
        { token }
      );

      if (data === false) {
        localStorage.setItem("token", "");
      } else if (data === "notoken") {
        setFavoritesMovies([]);
      } else {
        setFavoritesMovies(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDislikeMovie = async (movie) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3001/favorites/delete",
        {
          token,
          currentMovie: movie,
        }
      );
      await handleGetFavorites();
    } catch (e) {
      console.error(e);
    }
  };

  const getIsAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await axios.post(
          "http://localhost:3001/admin/isAdmin",
          {
            token,
          }
        );

        setIsAdmin(data);
      } else setIsAdmin(false);
    } catch (error) {
      console.log(error);
    }
  };

  const userIsLogin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      handleGetFavorites();
      getMovies();
      setIsUserLogin(true);
      getIsAdmin();
      getUserComments();
      getFavoritePersons();
      navigate("/");
    } else {
      handleGetFavorites();
      getFavoritePersons();
      getMovies();
      setIsUserLogin(false);
    }
  };

  const getUserComments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token !== "") {
        const { data } = await axios.post(
          "http://localhost:3001/getUserInfo/getUserComments",
          {
            token,
          }
        );
        if (data) {
          setUserComments(data.userComments);
          setUserCommentsMovies(data.userCommentsMovies);
        } else if (data === false) {
          localStorage.setItem("token", "");
          userIsLogin();
        } else setUserComments([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [userInfo, setUserInfo] = useState({});

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token !== "") {
        const { data } = await axios.post("http://localhost:3001/getUserInfo", {
          token,
        });
        setUserInfo(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addRating = async (rating, movieId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/rating/add", {
        token,
        movieId,
        rating,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const removeRating = async (movieId) => {
    try {
      console.log(movieId);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/rating/delete", {
        token,
        movieId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userIsLogin();
    getIsAdmin();
    getUserComments();
  }, []);

  useEffect(() => {
    handleGetFavorites();
  }, []);

  useEffect(() => {
    getMovies();
    getPersons();
    getFavoritePersons();
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.overflow = "scroll";
      document.querySelector(".movie").classList.remove("active");
      document.querySelector(".backShadow").classList.remove("active");
      document
        .getElementById("movieWindow")
        .scrollTo({ top: 0, behavior: "smooth" });
      sessionStorage.setItem("movieScroll", 0);
    }
  }, [location.pathname]);

  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleClick = (text) => {
    setOpen(true);
    setAlertText(text);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="App">
      {!location.pathname.includes("/auth") &&
      !location.pathname.includes("/admin") &&
      !location.pathname.includes("/avatars") ? (
        <Header
          movies={movies}
          userInfo={userInfo}
          getUserInfo={getUserInfo}
          openMovie={openMovie}
          userIsLogin={userIsLogin}
          persons={persons}
          openPerson={openPerson}
          isAdmin={isAdmin}
          getIsAdmin={getIsAdmin}
        />
      ) : (
        <div></div>
      )}

      <MoviePlayer
        moviePlayer={moviePlayer}
        isPlayerOpen={isPlayerOpen}
        setIsPlayerOpen={setIsPlayerOpen}
        setMoviePlayer={setMoviePlayer}
      />
      <div className="movieWindow">
        <div className="backShadow" onClick={closeMovie}></div>
        <div className="movie" id="movieWindow">
          <Routes>
            <Route
              path="/movies/:id"
              element={
                <SingleMovie
                  handleClick={handleClick}
                  openPerson={openPerson}
                  closeMovie={closeMovie}
                  playMovie={playMovie}
                  userComments={userComments}
                  getUserComments={getUserComments}
                  handleLikeMovie={handleLikeMovie}
                  favoritesMovies={favoritesMovies}
                  handleDislikeMovie={handleDislikeMovie}
                  isTrailerPlay={isTrailerPlay}
                  userIsLogin={userIsLogin}
                  getUserInfo={getUserInfo}
                  userInfo={userInfo}
                  isAdmin={isAdmin}
                  getIsAdmin={getIsAdmin}
                  addRating={addRating}
                  removeRating={removeRating}
                  currentMovieRating={currentMovieRating}
                />
              }
            />

            <Route
              path="/personal/movies/:id"
              element={
                <SingleMovie
                  handleClick={handleClick}
                  openPerson={openPerson}
                  closeMovie={closeMovie}
                  getUserComments={getUserComments}
                  userComments={userComments}
                  playMovie={playMovie}
                  handleLikeMovie={handleLikeMovie}
                  favoritesMovies={favoritesMovies}
                  handleDislikeMovie={handleDislikeMovie}
                  isTrailerPlay={isTrailerPlay}
                  userIsLogin={userIsLogin}
                  getUserInfo={getUserInfo}
                  userInfo={userInfo}
                  isAdmin={isAdmin}
                  getIsAdmin={getIsAdmin}
                  addRating={addRating}
                  removeRating={removeRating}
                  currentMovieRating={currentMovieRating}
                />
              }
            />
            <Route
              path="/categories/movies/:id"
              element={
                <SingleMovie
                  handleClick={handleClick}
                  openPerson={openPerson}
                  closeMovie={closeMovie}
                  getUserComments={getUserComments}
                  userComments={userComments}
                  playMovie={playMovie}
                  handleLikeMovie={handleLikeMovie}
                  favoritesMovies={favoritesMovies}
                  handleDislikeMovie={handleDislikeMovie}
                  isTrailerPlay={isTrailerPlay}
                  userIsLogin={userIsLogin}
                  getUserInfo={getUserInfo}
                  userInfo={userInfo}
                  isAdmin={isAdmin}
                  getIsAdmin={getIsAdmin}
                  addRating={addRating}
                  removeRating={removeRating}
                  currentMovieRating={currentMovieRating}
                />
              }
            />
            <Route
              path="/categories/:categoryId/movies/:id"
              element={
                <SingleMovie
                  handleClick={handleClick}
                  openPerson={openPerson}
                  closeMovie={closeMovie}
                  getUserComments={getUserComments}
                  userComments={userComments}
                  playMovie={playMovie}
                  handleLikeMovie={handleLikeMovie}
                  favoritesMovies={favoritesMovies}
                  handleDislikeMovie={handleDislikeMovie}
                  isTrailerPlay={isTrailerPlay}
                  getUserInfo={getUserInfo}
                  userInfo={userInfo}
                  userIsLogin={userIsLogin}
                  isAdmin={isAdmin}
                  getIsAdmin={getIsAdmin}
                  addRating={addRating}
                  removeRating={removeRating}
                  currentMovieRating={currentMovieRating}
                />
              }
            />

            <Route
              path="/movies/:id/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                  openMovie={openMovie}
                />
              }
            />
            <Route
              path="/categories/movies/:id/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                  openMovie={openMovie}
                />
              }
            />
            <Route
              path="/categories/:categoryId/movies/:id/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                  openMovie={openMovie}
                />
              }
            />
            <Route
              path="/personal/movies/:id/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                  openMovie={openMovie}
                />
              }
            />

            <Route
              path="/person/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  openMovie={openMovie}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />

            <Route
              path="/categories/person/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  openMovie={openMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
            <Route
              path="/categories/:categoryId/person/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  openMovie={openMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
            <Route
              path="/personal/person/:personId"
              element={
                <SinglePerson
                  openMovie={openMovie}
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
            <Route
              path="/comments/movies/:id"
              element={
                <SingleMovie
                  handleClick={handleClick}
                  openPerson={openPerson}
                  closeMovie={closeMovie}
                  getUserComments={getUserComments}
                  userComments={userComments}
                  playMovie={playMovie}
                  handleLikeMovie={handleLikeMovie}
                  favoritesMovies={favoritesMovies}
                  handleDislikeMovie={handleDislikeMovie}
                  isTrailerPlay={isTrailerPlay}
                  getUserInfo={getUserInfo}
                  userInfo={userInfo}
                  userIsLogin={userIsLogin}
                  isAdmin={isAdmin}
                  getIsAdmin={getIsAdmin}
                  addRating={addRating}
                  removeRating={removeRating}
                  currentMovieRating={currentMovieRating}
                />
              }
            />
            <Route
              path="/comments/person/:personId"
              element={
                <SinglePerson
                  openMovie={openMovie}
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
            <Route
              path="/comments/movies/:id/:personId"
              element={
                <SinglePerson
                  openMovie={openMovie}
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
          </Routes>
        </div>
      </div>

      <Routes id="home">
        <Route
          path="/"
          element={
            <Home
              openMovie={openMovie}
              movies={movies}
              handleDislikeMovie={handleDislikeMovie}
              handleLikeMovie={handleLikeMovie}
              favoritesMovies={favoritesMovies}
              playMovie={playMovie}
            />
          }
        >
          <Route
            path="/movies/:id"
            element={
              <SingleMovie
                handleClick={handleClick}
                openPerson={openPerson}
                closeMovie={closeMovie}
                userComments={userComments}
                playMovie={playMovie}
                handleLikeMovie={handleLikeMovie}
                getUserComments={getUserComments}
                favoritesMovies={favoritesMovies}
                handleDislikeMovie={handleDislikeMovie}
                isTrailerPlay={isTrailerPlay}
                userIsLogin={userIsLogin}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
                isAdmin={isAdmin}
                getIsAdmin={getIsAdmin}
                addRating={addRating}
                removeRating={removeRating}
                currentMovieRating={currentMovieRating}
              />
            }
          >
            <Route
              path="/movies/:id/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  openMovie={openMovie}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
          </Route>
          <Route
            path="/person/:personId"
            element={
              <SinglePerson
                closeMovie={closeMovie}
                favoritePersons={favoritePersons}
                openMovie={openMovie}
                getFavoritePersons={getFavoritePersons}
              />
            }
          />
        </Route>
        <Route path="/categories" element={<Categories />}>
          <Route
            path="/categories/movies/:id"
            element={
              <SingleMovie
                handleClick={handleClick}
                openPerson={openPerson}
                closeMovie={closeMovie}
                userComments={userComments}
                playMovie={playMovie}
                handleLikeMovie={handleLikeMovie}
                getUserComments={getUserComments}
                favoritesMovies={favoritesMovies}
                handleDislikeMovie={handleDislikeMovie}
                isTrailerPlay={isTrailerPlay}
                userIsLogin={userIsLogin}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
                isAdmin={isAdmin}
                getIsAdmin={getIsAdmin}
                addRating={addRating}
                removeRating={removeRating}
                currentMovieRating={currentMovieRating}
              />
            }
          >
            <Route
              path="/categories/movies/:id/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  openMovie={openMovie}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
          </Route>
          <Route
            path="/categories/person/:personId"
            element={
              <SinglePerson
                closeMovie={closeMovie}
                openMovie={openMovie}
                favoritePersons={favoritePersons}
                getFavoritePersons={getFavoritePersons}
              />
            }
          />
        </Route>
        <Route
          path="/categories/:categoryId"
          element={<SingleCategory openMovie={openMovie} />}
        >
          <Route
            path="/categories/:categoryId/movies/:id"
            element={
              <SingleMovie
                handleClick={handleClick}
                openPerson={openPerson}
                closeMovie={closeMovie}
                userComments={userComments}
                playMovie={playMovie}
                handleLikeMovie={handleLikeMovie}
                getUserComments={getUserComments}
                favoritesMovies={favoritesMovies}
                handleDislikeMovie={handleDislikeMovie}
                isTrailerPlay={isTrailerPlay}
                userIsLogin={userIsLogin}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
                isAdmin={isAdmin}
                getIsAdmin={getIsAdmin}
                addRating={addRating}
                removeRating={removeRating}
                currentMovieRating={currentMovieRating}
              />
            }
          >
            <Route
              path="/categories/:categoryId/movies/:id/:personId"
              element={
                <SinglePerson
                  closeMovie={closeMovie}
                  favoritePersons={favoritePersons}
                  openMovie={openMovie}
                  getFavoritePersons={getFavoritePersons}
                />
              }
            />
          </Route>
          <Route
            path="/categories/:categoryId/person/:personId"
            element={
              <SinglePerson
                closeMovie={closeMovie}
                openMovie={openMovie}
                favoritePersons={favoritePersons}
                getFavoritePersons={getFavoritePersons}
              />
            }
          />
        </Route>

        <Route
          path="/personal"
          element={
            <Personal
              handleGetFavorites={handleGetFavorites}
              openMovie={openMovie}
              favoritesMovies={favoritesMovies}
              favoritePersons={favoritePersons}
              openPerson={openPerson}
              getFavoritePersons={getFavoritePersons}
            />
          }
        >
          <Route
            path="/personal/movies/:id"
            element={
              <SingleMovie
                handleClick={handleClick}
                openPerson={openPerson}
                closeMovie={closeMovie}
                playMovie={playMovie}
                getUserComments={getUserComments}
                handleLikeMovie={handleLikeMovie}
                userComments={userComments}
                favoritesMovies={favoritesMovies}
                handleDislikeMovie={handleDislikeMovie}
                isTrailerPlay={isTrailerPlay}
                userIsLogin={userIsLogin}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
                isAdmin={isAdmin}
                getIsAdmin={getIsAdmin}
                addRating={addRating}
                removeRating={removeRating}
                currentMovieRating={currentMovieRating}
              />
            }
          />
          <Route
            path="/personal/movies/:id/:personId"
            element={
              <SinglePerson
                closeMovie={closeMovie}
                openMovie={openMovie}
                favoritePersons={favoritePersons}
                getFavoritePersons={getFavoritePersons}
              />
            }
          />
          <Route
            path="/personal/person/:personId"
            element={
              <SinglePerson
                openMovie={openMovie}
                closeMovie={closeMovie}
                favoritePersons={favoritePersons}
                getFavoritePersons={getFavoritePersons}
              />
            }
          />
        </Route>
        {isAdmin == true ? (
          <Route path="/admin" element={<Admin />}>
            <Route path="/admin/addMovie" element={<addMovie />} />
            <Route path="/admin/addPerson" element={<AddPerson />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>
        ) : null}

        <Route
          path="/auth"
          element={<Auth userIsLogin={userIsLogin} getIsAdmin={getIsAdmin} />}
        ></Route>
        <Route
          path="/avatars"
          element={<Avatars userInfo={userInfo} getUserInfo={getUserInfo} />}
        ></Route>
        <Route
          path="/comments"
          element={
            <MyComments
              getUserComments={getUserComments}
              userComments={userComments}
              userCommentsMovies={userCommentsMovies}
              handleClick={handleClick}
              userInfo={userInfo}
              openMovie={openMovie}
            />
          }
        >
          <Route
            path="/comments/movies/:id"
            element={
              <SingleMovie
                handleClick={handleClick}
                openPerson={openPerson}
                closeMovie={closeMovie}
                playMovie={playMovie}
                getUserComments={getUserComments}
                handleLikeMovie={handleLikeMovie}
                userComments={userComments}
                favoritesMovies={favoritesMovies}
                handleDislikeMovie={handleDislikeMovie}
                isTrailerPlay={isTrailerPlay}
                userIsLogin={userIsLogin}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
                isAdmin={isAdmin}
                getIsAdmin={getIsAdmin}
                addRating={addRating}
                removeRating={removeRating}
                currentMovieRating={currentMovieRating}
              />
            }
          />
          <Route
            path="/comments/person/:personId"
            element={
              <SinglePerson
                openMovie={openMovie}
                closeMovie={closeMovie}
                favoritePersons={favoritePersons}
                getFavoritePersons={getFavoritePersons}
              />
            }
          />
          <Route
            path="/comments/movies/:id/:personId"
            element={
              <SinglePerson
                openMovie={openMovie}
                closeMovie={closeMovie}
                favoritePersons={favoritePersons}
                getFavoritePersons={getFavoritePersons}
              />
            }
          />
        </Route>
      </Routes>
      {!location.pathname.includes("/auth") &&
      !location.pathname.includes("/admin") ? (
        <Footer />
      ) : (
        <div></div>
      )}
      {!location.pathname.includes("/auth") ? (
        <ul className="bottomNav">
          <li>
            <NavLink
              exact
              to="/"
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#b5b5b5",
              })}
            >
              {({ isActive }) => (
                <div>
                  {isActive ? <MdHome /> : <MdOutlineHome />}
                  Главная
                </div>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#b5b5b5",
              })}
            >
              {({ isActive }) => (
                <div>
                  {isActive ? <MdRectangle /> : <MdOutlineRectangle />}
                  Фильмы
                </div>
              )}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/personal"
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#b5b5b5",
              })}
            >
              {({ isActive }) => (
                <div>
                  {isActive ? <MdBookmarks /> : <MdOutlineBookmarks />}
                  Мое
                </div>
              )}
            </NavLink>
          </li>
        </ul>
      ) : (
        <div></div>
      )}
      <div>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={alertText}
          sx={{ width: "100px" }}
        />
      </div>
    </div>
  );
}

export default App;
