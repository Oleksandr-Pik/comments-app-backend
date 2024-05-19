# comments-app-backend

SPA-приложение: Комментарии (backend)
Пользователь может оставлять комментарии и прикреплять к комментарию картинку. Изображение должно быть не более 320х240 пикселей, при попытке залить изображение большего размера, картинка пропорционально уменьшается до заданных размеров, допустимые форматы файлов: JPG, GIF, PNG. Размер загружаемой картинки не более 2 Мб. Все введенные комментарии оставленные пользователем сохраняются в нереляционной базе данных (MongoDB), включая данные о пользователе (данные которые помогут идентифицировать клиента).

Base URL:
https://comments-app-backend.onrender.com
Маршруты:
/users - Авторизация пользователей
/api/comments - Работа с коммнтариями пользователей
Авторизация пользователей. Эндпоинты:
/users/register
Для регистрации пользователя необходимо отправить на сервер данные.

Method: POST

            Content-Type: application/json
            RequestBody: {
              "name": "user name",
              "email": "example@example.com",
              "password": "examplepassword",
              "homePage": "exampleURL" - необязательное поле
            }
          
Если все данные коректны прийдёт ответ от сервера

            Status: 201 Created
            Content-Type: application/json
            ResponseBody: {
              "user": {
                "name": "user name",
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
          
Для автоизации использовался JWT. Срок действия токена - 23 часа.

Успешная авторизация

            Status: 200 OK
            Content-Type: application/json
            ResponseBody: {
              "token": "exampletoken",
              "user": {
                "name": "user name",
                "email": "example@example.com"
              }
            }
          
/users/current
Method: GET

Текущий пользователь - получить данные пользователя по токену

            Authorization: "Bearer {{token}}"
          
Успех

            Status: 200 OK
            Content-Type: application/json
            ResponseBody: {
              "name": "user name",
              "email": "example@example.com",
              "homePage": "exampleURL",
              "avatarURL": "exampleURL"
            }
          
/users/logout
Логаут и удаление токена из БД

Method: GET

            Authorization: "Bearer {{token}}"
          
Успех

            Status: 204 No Content
          
/users/avatars
Method: PATCH

Для изменения аватарки пользователя отправляется запрос

            Content-Type: multipart/form-data
            Authorization: "Bearer {{token}}"
            RequestBody: загруженный файл
          
Изображение должно быть не более 250х250 пикселей, при попытке залить изображение большего размера, картинка пропорционально уменьшается до заданных размеров, допустимые форматы файлов: JPG, GIF, PNG. Размер загружаемой картинки не более 2 Мб.

Обработанные аватарки сохраняются в каталоге public/avatars, имя файла - это id пользователя.

/users/recaptcha
Method: POST

Пример использования reCaptcha

Фронтенд часть находится в гит репозитории в папке frontend-demo/.

            method: "POST"

            Content-type: "application/json"
            RequestBody: {
              "name": "name",
              "email": "email",
              "captcha": {captcha}
            }
          
Работа с комментариями пользователей. Эндпоинты:
/api/comments/
/api/comments/:id
/api/comments/:id/replies