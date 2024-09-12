import React, { useEffect } from "react";
import cls from "./Categories.module.scss";
import { Link } from "react-router-dom";
import categories from "./categoriesArray";

function Categories(props) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className={cls.moviesCategories}>
      <div className={cls.categories}>
        <h1>Жанры</h1>
        <div className={cls.categoriesContainer}>
          {categories.map((el) => {
            return (
              <Link to={`/categories/${el.id}`} style={{ color: "#fff" }}>
                <div
                  className={cls.category}
                  style={{ backgroundColor: el.color }}
                >
                  <img src={el.img} alt="" />
                  <h2>{el.title}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Categories;
