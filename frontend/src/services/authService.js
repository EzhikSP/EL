export async function login(username, password) {
  try {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка входа");
    }

    const data = await response.json();
    console.log("📥 Ответ сервера:", data);
    localStorage.setItem("token", data.access_token);
    console.log("🔍 Токен, который записываем:", data.access_token);
    return data;
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw new Error(error.message || "Ошибка сети при входе");
  }
}

export async function register({ username, password, email, character_class, race }) {
  try {
    console.log("Отправляем в /register:", {
      username,
      password,
      confirm_password: password,
      email,
      character_class,
      race,
    });
    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        confirm_password: password, // FastAPI требует confirm_password
        email,
        character_class, // FastAPI требует character_class
        race,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Ошибка регистрации (ответ сервера):", errorData);

      // Если errorData.detail — массив или объект, превратим в строку
      let errorMessage = "Ошибка регистрации";
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.join(", "); // Если массив, объединим ошибки
      } else if (typeof errorData.detail === "object") {
        errorMessage = JSON.stringify(errorData.detail); // Если объект, превратим в строку
      }
      console.log("Ошибка регистрации (ответ сервера):", errorData);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    throw new Error(error.message || "Ошибка сети при регистрации");
  }
}
