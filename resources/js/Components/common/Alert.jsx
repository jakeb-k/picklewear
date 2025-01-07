import { CSSTransition } from "react-transition-group";
import { useState, useEffect } from "react";

export default function Alert(props) {
    const message = props.message;
    const status = props.status;
    const [showAlert, setShowAlert] = useState(props.showAlert ?? false);

    useEffect(() => {  
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, []);

    return (
        <CSSTransition
                in={showAlert}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
        <div className="border-2 border-main rounded-xl px-8 flex fixed py-4 top-24 right-12 h-8 items-center bg-secondary">
            <i className="fa-regular fa-circle-check text-main mt-1"></i>
            <p className="tracking-wide ml-4 text-main font-oswald">
               {message}
            </p>
        </div>
        </CSSTransition>
    );
}
