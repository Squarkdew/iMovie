import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

function Users(props) {
  const [movies, setMovies] = useState([]);

  const getMovies = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.post("http://localhost:3001/getMovies", {
        token,
      });

      setMovies(data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const { data } = await axios.post("http://localhost:3001/deleteMovie", {
        id,
      });
      if (data) {
        alert("Успешно");
        getMovies();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = (id) => {
    if (window.confirm("Удалить?")) {
      deleteMovie(id);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      {movies.map((el) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              position: "relative",
            }}
          >
            <img src={el.searchPoster} alt="" style={{ height: "200px" }} />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h1>{el.title}</h1>
              <div style={{ display: "flex", gap: "10px" }}>
                <span> {el.rating}</span>
                <span>{el.engTitle}</span>
                <span>{el.year}</span>
              </div>
            </div>
            <div>
              <RxCross2
                style={{
                  fontSize: "30px",
                  position: "absolute",
                  right: "30px",
                  bottom: "90px",
                  cursor: "pointer",
                }}
                onClick={() => handleClick(el.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Users;
