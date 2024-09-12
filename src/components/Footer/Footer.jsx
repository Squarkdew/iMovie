import React from "react";
import cls from "./Footer.module.scss";

function Footer(props) {
  return (
    <div className={cls.footer}>
      <div className={cls.footerAbout}>
        © 2023–2024 iMovie. 18+ <br /> Все права защищены. <br /> iMovie® и
        связанные торговые марки принадлежат их законным владельцам. <br />
        Проект находится на стадии активной разработки и тестирования. <br />
        <span className={cls.adaptiveTitle}>
          Все предоставленные материалы могут быть изменены без предварительного
          уведомления и не являются окончательными.
        </span>
      </div>
      <div>
        <span>Проект компании</span> iMovie®
      </div>
    </div>
  );
}

export default Footer;
