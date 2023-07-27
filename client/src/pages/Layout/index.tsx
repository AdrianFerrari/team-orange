import SignUpIconSVG from "../../assets/SignUpIconSVG";
import CartIconSVG from "../../assets/CartIconSVG";
import Footer from "./Footer";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "../../components/ui/Link";
import { NavLink } from "../../components/ui/NavLink";
import { StoreName } from "../../types/types";

export function Layout() {
    const storeNames = useLoaderData() as StoreName[];
    const navigate = useNavigate();
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
                        <button className={styles.button_cart} onClick={() => navigate("/cart")}>
                            <CartIconSVG />
                        </button>
                        <button className={styles.button_signup}>
                            <SignUpIconSVG />
                        </button>
                    </div>
                </div>
            </nav>
            <Outlet />
            <Footer />
        </div>
    );
}
