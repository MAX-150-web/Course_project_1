const authModal = document.getElementById("authModal");

const openLogin = document.getElementById("openLogin");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");

const closeModal = document.getElementById("closeModal");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const appointmentForm = document.getElementById("appointmentForm");
const appointmentMessage = document.getElementById("appointmentMessage");

const callbackBtn = document.getElementById("callbackBtn");

function scrollToSection(element) {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;
  const extraGap = 18;
  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
  const scrollPosition = elementTop - headerHeight - extraGap;

  window.scrollTo({
    top: Math.max(scrollPosition, 0),
    behavior: "smooth"
  });
}

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      event.preventDefault();
      scrollToSection(targetSection);
      history.pushState(null, "", targetId);
    }
  });
});

openLogin.addEventListener("click", function () {
  authModal.classList.remove("hide");
  loginForm.classList.remove("hide");
  registerForm.classList.add("hide");
});

closeModal.addEventListener("click", function () {
  authModal.classList.add("hide");
});

showLogin.addEventListener("click", function () {
  loginForm.classList.remove("hide");
  registerForm.classList.add("hide");
});

showRegister.addEventListener("click", function () {
  registerForm.classList.remove("hide");
  loginForm.classList.add("hide");
});

window.addEventListener("click", function (event) {
  if (event.target === authModal) {
    authModal.classList.add("hide");
  }
});

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!name || !email || !password) {
    registerMessage.style.color = "red";
    registerMessage.textContent = "Заполните все поля.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find(function (user) {
    return user.email === email;
  });

  if (exists) {
    registerMessage.style.color = "red";
    registerMessage.textContent = "Пользователь с таким email уже существует.";
    return;
  }

  const newUser = {
    name: name,
    email: email,
    password: password
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  registerMessage.style.color = "green";
  registerMessage.textContent = "Регистрация прошла успешно.";

  registerForm.reset();
  showCurrentUser();

  setTimeout(function () {
    authModal.classList.add("hide");
    registerMessage.textContent = "";
  }, 800);
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  if (!foundUser) {
    loginMessage.style.color = "red";
    loginMessage.textContent = "Неверный email или пароль.";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(foundUser));

  loginMessage.style.color = "green";
  loginMessage.textContent = "Вход выполнен.";

  loginForm.reset();
  showCurrentUser();

  setTimeout(function () {
    authModal.classList.add("hide");
    loginMessage.textContent = "";
  }, 800);
});

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  showCurrentUser();
});

function showCurrentUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    userName.textContent = currentUser.name;
    openLogin.classList.add("hide");
    logoutBtn.classList.remove("hide");
  } else {
    userName.textContent = "";
    openLogin.classList.remove("hide");
    logoutBtn.classList.add("hide");
  }
}

appointmentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("appName").value.trim();
  const phone = document.getElementById("appPhone").value.trim();

  if (!name || !phone) {
    appointmentMessage.style.color = "red";
    appointmentMessage.textContent = "Заполните имя и номер телефона.";
    return;
  }

  const appointment = {
    name: name,
    phone: phone,
    service: "Бесплатная первичная консультация",
    date: new Date().toLocaleString()
  };

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments.push(appointment);

  localStorage.setItem("appointments", JSON.stringify(appointments));

  appointmentMessage.style.color = "green";
  appointmentMessage.textContent = "Заявка сохранена. Мы скоро свяжемся с вами.";

  appointmentForm.reset();
});

callbackBtn.addEventListener("click", function () {
  const appointmentSection = document.getElementById("appointment");
  const phoneInput = document.getElementById("appPhone");

  scrollToSection(appointmentSection);

  setTimeout(function () {
    phoneInput.focus();
  }, 500);
});

showCurrentUser();