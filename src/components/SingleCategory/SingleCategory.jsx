import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import categories from "../MoviesCategories/categoriesArray";
import cls from "./SingleCategory.module.scss";

function SingleCategory({ openMovie }) {
  const { categoryId } = useParams();
  const [category, setCategory] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  const getCategoryMovies = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3001/getMovies/categoryMovies",
        { category: category.category, token }
      );
      setFilteredMovies(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const categoryFind = categories.find((el) => el.id == categoryId);
    if (categoryFind) {
      setCategory(categoryFind);
    }
    window.scrollTo({ top: 0 });
  }, [categoryId]);

  useEffect(() => {
    if (category) {
      getCategoryMovies(category);
    }
  }, [category]);

  return (
    <div className={cls.filteredContainer}>
      <div className={cls.categoryTitle}>
        <h1>{category.title}</h1>
      </div>
      <div className={cls.filtered}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((el) => {
            return (
              <img
                src={el.poster}
                onClick={() => openMovie(el.id)}
                className={cls.categoryPoster}
                alt=""
              />
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default SingleCategory;
