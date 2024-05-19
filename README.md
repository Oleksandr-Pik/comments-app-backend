# comments-app-backend

base url: https://comments-app-backend.onrender.com

Comments App
SPA-приложение: Комментарии (backend)
Пользователь может оставлять комментарии и прикреплять к комментарию картинку. Все введенные комментарии оставленные пользователем сохраняются в нереляционной базе данных (MongoDB), включая данные о пользователе (данные которые помогут идентифицировать клиента).

Base URL:
https://comments-app-backend.onrender.com
Эндпоинты:
/users - Авторизация пользователей
/api/comments - Работа с коммнтариями пользователей
Авторизация пользователей. Маршруты:
/users/register
Для регистрации пользователя необходимо отправить на сервер данные.

Method: POST

            Content-Type: application/json
            RequestBody: {
              "name": "yuor name",
              "email": "example@example.com",
              "password": "examplepassword",
              "homePage": "exampleURL" - необязательное поле
            }
          
Если все данные коректны прийдёт ответ от сервера

            Status: 201 Created
            Content-Type: application/json
            ResponseBody: {
              "user": {
                "name": "yuor name",
                "email": "example@example.com"
              }
            }
          
Пользователь будет создан в БД. Для добавления аватара исользовался сервис gravatar.com

На почту, указанную при регистрации прийдёт письмо в котором будет ссылка, нажав на которую пользователь потвердит свою электронную почту и в БД поле 'verify' поменяет значение на 'true'.

Для отправки писем использовался сервис SendGrid

/users/verify/:verificationToken
Method: GET

С этим маршрутом генерируется ссылка для отправки в письме для подтверрждения электронной почты

            ResponseBody: {
              message: "Verification successful"
            }
          
/users/verify
Этот маршрут используется для повторной отправки электронного письма на указанную почту, если пользователь уже был добавлен в БД и поле 'verify' имеет значение 'false'.

Method: POST

            Content-Type: application/json
            RequestBody: {
              "email": "example@example.com"
            }
          
Успех:

            Status: 200 OK
            ResponseBody: {
              message: "Verification email sent"
            }
          
/users/login
Авторизация пользователя в системе

Method: POST

            Content-Type: application/json
            RequestBody: {
              "email": "example@example.com",
              "password": "examplepassword"
            }
          
Успешная авторизация

            Status: 200 OK
            Content-Type: application/json
            ResponseBody: {
              "token": "exampletoken",
              "user": {
                "name": "yuor name",
                "email": "example@example.com"
              }
            }
          
/users/avatars
/users/current
/users/logout
/users/recaptcha
