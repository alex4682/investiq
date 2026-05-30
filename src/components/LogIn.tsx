import React from 'react';

const LogIn = () => {
    return (
        <section>
            <p>Ви можете авторизуватися за допомогою акаунта Google</p>
            <button>Google</button>
            <p>Або увійти за допомогою ел. пошти та паролю після реєстрації</p>
            <form action="">
                <label htmlFor="email">Електронна пошта:</label>
                <input type="email" id="email" placeholder="your@email.com" required />
                <label htmlFor="password">Пароль:</label>
                <input type="password" id="password" placeholder="Пароль" required />
            </form>
        </section>
    );
}

export default LogIn;
