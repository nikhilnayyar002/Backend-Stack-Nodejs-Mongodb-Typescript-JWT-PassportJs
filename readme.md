# Backend Stack (Nodejs, Mongodb, Typescript, JWT, PassportJs)

> **Note:**
> A mongodb url is predefined in this example therefore you may specify your own if you want.

## Setup

* Define the mongodb database url in ``` src/config/config.json``` file:

	```
 	{
 	   "restAPI": "/api",
 	   "server":{
 	     "dev":{
 	         "isProduction":false,
 	         "port":3000,
 	         "mongoURI":"mongodb url here",   <----------- here
 	         "jwtSecret":"SECRET#123",
 	         "jwtExp": "30m"
 	     },
 	     "prod":{
 	         "isProduction":true,
 	         "port":3000,
 	         "mongoURI":"mongodb url here",   <----------- here
 	         "jwtSecret":"SECRET#123",
 	         "jwtExp": "30m"
 	     }
 	   },
 	   "passwordSecret":"SECRET#123"
 	}	
	```
* npm install

## Running
* npm run dev

## Building
* npm run build
* npm run start

## Rest API Routes Example & Usage

* For Both Employee & Candidate

	```
	
	POST /api/auth/register
    Content-Type: application/json

	{
        "fullName": "Nikhil Nayyar",
        "password": "nikhil_nayyar",
        "email":"nikhilnayyar002@gmail.com",
        "isEmployee":true
	}


	POST /api/auth/authenticate
    Content-Type: application/json

	{
        "email": "nikhilnayyar002@gmail.com",
        "password": "nikhil_nayyar"
	}


	GET http://localhost:3000/api/auth/userProfile
    Authorization: Bearer <JWT-TOKEN>

	```

* Employee

	```
	- Post a New Job
	
	POST http://localhost:3000/api/jobs
    Authorization: Bearer <JWT-TOKEN>
    Content-Type: application/json

    {
       "_id":"job1",
       "title":"anyvalue",
       "location":"anyvalue",
       "date,status":"anyvalue",
       "candidate":"anyvalue",
       "more":"anyvalue",
       "screen":"anyvalue",
       "interview":"anyvalue",
       "offer":"anyvalue",
       "onHolds":"anyvalue",
       "rejected":"anyvalue"
    }


	- Open jobs

	GET http://localhost:3000/api/jobs/<empID>
    Authorization: Bearer <JWT-TOKEN>

	```

* Candidate
	```
	- Received Jobs Page

	GET http://localhost:3000/api/candidate/jobs
    Authorization: Bearer <JWT-TOKEN>


	- Accepted Jobs

	GET http://localhost:3000/api/candidate/accepted-jobs
    Authorization: Bearer <JWT-TOKEN>

	
	- Rejected Jobs

	GET http://localhost:3000/api/candidate/rejected-jobs
    Authorization: Bearer <JWT-TOKEN>


	- Accept/Unaccept Job

	GET http://localhost:3000/api/candidate/accept-job/job1
    Authorization: Bearer <JWT-TOKEN>

	GET http://localhost:3000/api/candidate/reject-job/job1
    Authorization: Bearer <JWT-TOKEN>


	- Reject/Unreject Job

	GET http://localhost:3000/api/candidate/unaccept-job/job1
    Authorization: Bearer <JWT-TOKEN>

	GET http://localhost:3000/api/candidate/unreject-job/job1
    Authorization: Bearer <JWT-TOKEN>

	```