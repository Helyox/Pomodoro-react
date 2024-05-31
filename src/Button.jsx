import React from "react";

const Button = ({ text, id, classe, onClick}) => {
    
    const handleClick = () => {
        const lesid = ["pomodoroBtn", "shortBtn", "longBtn"];

    // Enlever la classe "current" de tous les éléments
    for (let i = 0; i < lesid.length; i++) {
        const element = document.getElementById(lesid[i]);
        if (element) {
            element.classList.remove("current");
        }
    // Ajouter la classe "current" uniquement à l'élément cliqué
    
    const btn = document.getElementById(id);
    if (btn) {
        btn.classList.add("current");
    }
    if (onClick) {
        onClick();
    }
}
    };

    return (
        <div className={classe} id={id} onClick={handleClick} >
            <p>{text}</p>
        </div>
    );
};

export default Button;
