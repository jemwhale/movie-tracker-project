# movie-tracker-project

Run npm test to re-seed database back to original data.
All request queries will be converted to lower case. 

GET REQUESTS - all via url

//Return all users 
http://localhost:3000/users

//Return all users by key (id, name, email)
http://localhost:3000/users/all/${key}

//Return one user by id
http://localhost:3000/users/id/${id}

//Return one user by name (use '-' for spaces)
http://localhost:3000/users/name/${name}

//Return all shows from a specified user's watched list
http://localhost:3000/users/watched/${id}

//Return all unrated shows from a specified user's watched list
http://localhost:3000/users/unrated/${id}

//Return all rated shows from a specified user's watched list
http://localhost:3000/users/rated/${id}

//Return all rated shows from a specified user's watched list
http://localhost:3000/users/${userid}/${showid}

//Return all shows
http://localhost:3000/shows

//Return all shows by key (title, genre)
http://localhost:3000/users/all/${key}

//Return one show by id
http://localhost:3000/shows/id/${id}

//Return one show by title (use '-' for spaces)
http://localhost:3000/shows/title/${title}

//Return one show by title (use '-' for spaces)
http://localhost:3000/shows/genre/${genre}




POST REQUESTS - all via raw json within body of request

//Create a new user
//JSON format:
{
    "name": STRING,
    "email": STRING
}
http://localhost:3000/users/create

//Add a show to a user's watched list (body)
//JSON format:
{
    "userId": STRING,
    "showId": STRING
}
http://localhost:3000/users/add-to-watched

//Create a new show
//JSON format:
{
    "title": STRING,
    "genre": ARRAY of STRINGS
}
http://localhost:3000/shows/create




PUT REQUESTS - all via raw json within body of request

//Update a rating for a specified show as a specified user
//JSON format:
{
    "userId": STRING,
    "showId": STRING,
    "rating": NUMBER
}
http://localhost:3000/shows/rate

//Add n genres to a specified show
//JSON format:
{
    "showId": STRING,
    "genre": ARRAY of STRINGS
}
http://localhost:3000/shows/add-genres

//Remove n genres to a specified show
//JSON format:
{
    "showId": STRING,
    "genre": ARRAY of STRINGS
}
http://localhost:3000/shows/remove-genres




DELETE REQUESTS - all via raw json within body of request

//Delete a specified user
//JSON format:
{
    "id": STRING
}
http://localhost:3000/users/delete

//Delete a specified show
//JSON format:
{
    "id": STRING
}
http://localhost:3000/shows/delete
