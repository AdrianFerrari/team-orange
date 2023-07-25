import { useState } from "react";

export function useLogin() {
    const [data, setData] = useState();
    const isAuth = (username: string, password: string) => {
        fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => setData(data));
    };

    return { data, isAuth };
}
