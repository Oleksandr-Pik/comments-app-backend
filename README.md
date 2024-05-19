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
Доступ имеют только авторизиованные пользователи

Отправка комментария (корневого)

Method: POST

              Content-Type: multipart/form-data
              Authorization: "Bearer {{token}}"
              RequestBody: {
                "text": "text of comment",
                "picture": загруженный файл картинки
              }
            
Изображение должно быть не более 320х240 пикселей, при попытке залить изображение большего размера, картинка пропорционально уменьшается до заданных размеров, допустимые форматы файлов: JPG, GIF, PNG. Размер загружаемой картинки не более 2 Мб.

Обязательное поле author берется из БД по токену авторизации

typeComment присваивается значение head

Если все данные коректны прийдёт ответ от сервера

              Status: 201 Created
              Content-Type: application/json
              ResponseBody: {
                "comment": {
                  "text": "Test comment 10",
                  "picture": "pictures\\407AVNLKukRjzmS0I2nyO.jpg",
                  "typeComment": "head",
                  "author": "6649f88acdeb58ba81c610a7",
                  "replies": [],
                  "_id": "664a6d89a1bbd38a44629fdc",
                  "createdAt": "2024-05-19T21:22:17.589Z",
                  "updatedAt": "2024-05-19T21:22:17.589Z"
                }
              }
            
Запрос всех комментариев из БД

Method: GET

              Authorization: "Bearer {{token}}"
            
Успех

              Status: 200 Ok
              Content-Type: application/json
              ResponseBody: {
                "comments": [
                    {
                      "_id": "664535bd4df7a34a686572fc",
                      "text": "Some text for test blah blah blah",
                      "picture": "pictures\\407AVNLKukRjzmS0I2nyO.jpg",
                      "typeComment": "head",
                      "author": {
                          "_id": "6644fb7c25cbfb939c5f4682",
                          "name": "user name",
                          "email": "example@gmail.com"
                      },
                      "createdAt": "2024-05-15T22:22:53.990Z",
                      "replies": [
                          "6648eed83a38d934b2d05422",
                          "6648ef71c147589ac74d8f90",
                          "664908d997e19c218f3b1933"
                      ]
                    },
                    {
                      "_id": "6648c60f8b9088e90b959e0d",
                      "text": "Some text for test6",
                      "picture": null,
                      "typeComment": "reply",
                      "replyTo": "664535bd4df7a34a686572fc",
                      "author": {
                          "_id": "6644fb7c25cbfb939c5f4682",
                          "name": "user name2",
                          "email": "example2@gmail.com"
                      },
                      "replies": [],
                      "createdAt": "2024-05-18T15:15:27.759Z"
                    },
                    {
                      comment 3
                    },
                    {
                      comment ...
                    },
                    {
                      comment 25
                    }
                ],
                "page": {
                    "current": "1",
                    "total": 30
                }
              }
            
Комментарии разбиваются на страницы по 25 комментариев на каждой.

current - текущая страница

total - всего записей в БД

/api/comments/:id
Запрос комментария из БД по id

Method: GET

              Authorization: "Bearer {{token}}"
            
Успех

              Status: 200 Ok
              Content-Type: application/json
              ResponseBody: {
                "comment": {
                  "_id": "664a6d89a1bbd38a44629fdc",
                  "text": "Test comment 10",
                  "picture": "pictures\\407AVNLKukRjzmS0I2nyO.jpg",
                  "typeComment": "head",
                  "author": "6649f88acdeb58ba81c610a7",
                  "replies": [],
                  "createdAt": "2024-05-19T21:22:17.589Z",
                  "updatedAt": "2024-05-19T21:22:17.589Z"
                }
              }
            
Удаление комментария из БД по id

Удалить можно только те комментарии, которые принадлежат текущему пользователю.

При уделении комментария также удаляется и картинка прикреплённая к нему, если она есть.

Method: DELETE

              Authorization: "Bearer {{token}}"
            
Успех

              Status: 200 Ok
              Content-Type: application/json
              ResponseBody: {
                "comment": {
                  контент удаляемого объекта
                }
              }
            
Изменение комментария по id

Изменять можно только те комментарии, которые принадлежат текущему пользователю.

Method: PUT

              Content-Type: multipart/form-data
              Authorization: "Bearer {{token}}"
              RequestBody: {
                "text": "new text of comment"
              }
            
Успех

              Status: 200 Ok
              Content-Type: application/json
              ResponseBody: {
                "comment": {
                  контент изменённого объекта
                }
              }
            
/api/comments/:id/replies
Отправка ответа на комментарий id

Method: POST

              Content-Type: multipart/form-data
              Authorization: "Bearer {{token}}"
              RequestBody: {
                "text": "text of comment",
                "picture": загруженный файл картинки
              }
            
Изображение должно быть не более 320х240 пикселей, при попытке залить изображение большего размера, картинка пропорционально уменьшается до заданных размеров, допустимые форматы файлов: JPG, GIF, PNG. Размер загружаемой картинки не более 2 Мб.

Обязательное поле author берется из БД по токену авторизации

typeComment присваивается значение reply

в поле replyTo устанавливается id из параметров запроса.

Если все данные коректны прийдёт ответ от сервера

              Status: 201 Created
              Content-Type: application/json
              ResponseBody: {
                "comment": {
                  "text": "Text of comment",
                  "picture": "pictures\\407AVNLKukRjzmS0I2nyO.jpg",
                  "typeComment": "reply",
                  "replyTo": "664535bd4df7a34a686572fc",
                  "author": "6649f88acdeb58ba81c610a7",
                  "replies": [],
                  "_id": "664a6d89a1bbd38a44629fdc",
                  "createdAt": "2024-05-19T21:22:17.589Z",
                  "updatedAt": "2024-05-19T21:22:17.589Z"
                }
              }
            
# Схемы данных

User

          {
            name: {
              type: String,
              required: [true, "Name is required"],
            },
            email: {
              type: String,
              match: emailRegexp,
              required: [true, "Email is required"],
              unique: true,
            },
            password: {
              type: String,
              minLength: 6,
              required: [true, "Password is required"],
            },
            homePage: {
              type: String,
              match: urlRegexp,
              default: "",
            },
            avatarURL: {
              type: String,
              required: true,
            },
            token: {
              type: String,
              default: null,
            },
            verify: {
              type: Boolean,
              default: false,
            },
            verificationToken: {
              type: String,
              default: null,
            },
          }
        
Comment

          {
            text: {
              type: String,
              required: [true, "'text' not be empty"],
            },
            picture: {
              type: String,
            },
            typeComment: {
              type: String,
              enum: ["head", "reply"],
            },
            replyTo: {
              type: Schema.Types.ObjectId,
              ref: "comment",
              required: false,
            },
            author: {
              type: Schema.Types.ObjectId,
              ref: "user",
              required: true,
            },
            replies: [{
              type: Schema.Types.ObjectId,
              ref: "Comment",
              default: [],
              required: false
            }]
          }
        