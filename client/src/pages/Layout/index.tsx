import CartIconSVG from "../../assets/CartIconSVG";
import Footer from "./Footer";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "../../components/ui/Link";
import { NavLink } from "../../components/ui/NavLink";
import { StoreName, Token } from "../../types";
import { useAuthContext } from "../../Context/AuthContext";
import Fetcher from "../../services/Fetcher";
import { useEffect } from "react";
import { decodeJwt } from "jose";

export function Layout() {
    const { user, logOut } = useAuthContext();
    const storeNames = useLoaderData() as StoreName[];
    const navigate = useNavigate();

    useEffect(() => {
        const token = window.localStorage.getItem("user");
        if (token) {
            const user = decodeJwt(token) as Token;
            if (user.exp < Date.now() / 1000) {
                logOut();
            } else {
                Fetcher.addAuthInterceptor(token);
            }
        }
    }, [user]);

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <div className={`${styles.row} ${styles.secondRow}`}>
                    <Link to="/" className={styles.home}>
                        <h1>Shoppy</h1>
                    </Link>

                    <ul className={styles.stores}>
                        {storeNames.map(store => {
                            return (
                                <NavLink to={`stores/${store.id}`} key={store.id}>
                                    {store.name}
                                </NavLink>
                            );
                        })}
                    </ul>

                    <div className={styles.buttons_container}>
                        {user ? (
                            <>
                                Hi, {user.name} {user.lastName}
                                <NavLink to="/profile" className={styles.link}>
                                    Mi perfil
                                </NavLink>
                                <button className={styles.link} onClick={logOut}>
                                    logout
                                </button>
                                {user.rol === "Admin" && (
                                    <NavLink to="/admin" className={styles.link}>
                                        Admin
                                    </NavLink>
                                )}
                            </>
                        ) : (
                            <>
                                <NavLink to="/register" className={styles.link}>
                                    Registrarse
                                </NavLink>
                                <NavLink to="/login" className={styles.link}>
                                    Ingresar
                                </NavLink>
                            </>
                        )}
                        <button className={styles.button_cart} onClick={() => navigate("/cart")}>
                            <CartIconSVG />
                        </button>
                    </div>
                </div>
            </nav>
            <Outlet />
            <Footer />
        </div>
    );
}
