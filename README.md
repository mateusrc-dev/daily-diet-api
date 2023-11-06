# This application is part of a challenge on Rocketseat's Ignite NodeJs track where we created a diet back-end in NodeJs in which the user can create their diets and view their meals with details, edit a meal, delete, list. The user can also see details of their diets in general (number of meals on and off the diet, best sequence of days on the diet) 🚀🚀

## Below are some functional requirements and business rules for the application:

### ➡️ functional requirements:
- It must be possible to create a user
- It must be possible to identify the user between requests
- It must be possible to record a meal eaten, with the following information (meals must be related to a user):
    -Name
    - Description
    - Data and Time
    - Is it on the diet or not
- It must be possible to edit a meal, being able to change all the data above
- It must be possible to delete a meal
- It should be possible to list all of a user's meals
- It must be possible to view a single meal
- It must be possible to retrieve a user's analytics
    - Total number of meals recorded
    - Total number of meals within the diet
    - Total number of meals outside the diet
    - Best meal sequence of the day within the diet
- User can only view, edit and delete meals from what he created

### ➡️ business rules:
- if the user tries to create an account, it must be possible for the user to create that account
- when the user makes requests, it must be possible to identify the user among the requests
- if user tries to list meals, user can only view meals he created
- if the user tries to edit the data of a certain meal, it must be possible to edit a certain meal by its id

## Some libs used in the application:
sqlite3 -> relational database → easy to migrate to another database if necessary
fastify/cookie -> we will use a cookie to identify the user who is creating a diet
dotenv -> let's use dotenv to read the .env file inside NodeJs
fastify -> similar to express → brings traditional part used in building an API (dealing with routes, parameters, headers, responses in JSON, understands requests in JSON)
knex -> a query builder in which we don't need to focus much on learning SQL and we can focus on the applied language -> it is a query builder, making it easy to write queries with JS code
zod -> to validate data as application environment variables, data sent as parameters in routes

### If you want to test the application on your machine, download the repository and run the 'npm run dev' command in the repository terminal, you can use insomnia to test the application routes 🚀
