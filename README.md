## Installation
------

* Frontend Dependencies
```
    $ cd app && yarn install
```    
* Backend Dependencies
```
    $ cd ../server && yarn install
```
* Nodemon:
```
    $ yarn global add nodemon
```
* Docker
```
   $ sudo apt install docker.io
```
## Getting Started
------

#### Step 1: Setting up a fake domain
Copy & paste the command in your terminal:
````
    sudo echo '<IP ADDRESS OF LOCAL SERVER> boom-handraiser.com' | sudo tee -a /etc/hosts
````
Example:
```
    sudo echo '172.60.61.95 boom-handraiser.com' | sudo tee -a /etc/hosts
```
### Step 2: Setting up the database
  To start the database, run the command:
```
   $ docker-compose up -d db
```
Download and install [SQL Tabs](https://www.sqltabs.com/)
Open the SQL Tabs program. You'll see an address bar at the top of the window in that bar type in the following address.
```
    postgres://postgres@boom-handraiser.com:5432/handraiser
```
  * You'll be prompted to enter a **password** to connect to the database. The password is:
```
handraiser
```
#### Step 3
  * Run the following query in the SQL Tabs program:
```
    CREATE DATABASE handraiser;
```
#### Step 4
  * From the `server` directory of the application, run this command in the terminal:
```
    $ yarn migrate up
```
## Running the application
------
##### From the root directory of the application, run these commands:
* If your container is not running already:
```
    $ docker-compose up -d db
```
* Node / Nodemon
```
    $ nodemon server/index.js
```
* React Application
```
    $ yarn start
```

## Administrator
------
To access administrator privileges, press `Ctrl + Shift + Alt + PgUp` on the sign-in page or go to http://boom-handraiser.com:{YOURPORT}/admin/sign-in, then login using :
```
    username: admin
    password: Admin123
```
#### Privileges
1. Can create login/access keys for mentors.
2. Can view cohorts and their designated mentors.
3. Can view the list of used keys and those mentors who used that particular key.

## Mentors
------
To access mentor privileges, you need to have an unused login/access key and an email address with a `@boom.camp` domain.
#### Privileges
1. Can create cohorts.
2. Can modify cohort information like the cohort name, password as well as adding co-mentors.
3. Can view all students enrolled in their cohorts.
4. Can view the request queue of students with their corresponding concern.
5. Can either help, add or remove students from the queue.
6. Can have a realtime conversation with students.
7. Can move students being helped back to queue to prioritize other students' requests.
8. Can view the request logs of his cohorts. 
9. Can change cohort header image.

## Student
------
To access student privileges, you just need to have an email address with a `@boom.camp` domain.
#### Privileges
1. Can enroll in any cohort provided they know the cohort password.
2. Can ask for help inside the cohort. The queue is on a first come first serve basis.
3. Can view his request logs in each cohort that he's enrolled to.
5. Can remove himself from the queue.
6. Can have a realtime conversation with mentors inside cohorts.

## Chat
------
Students can only send messages to mentors inside cohorts. However, students can send private messages to other students likewise mentors to other mentors only. Also, mentors can create groupchats and add members to it.
##### Chat functionalities include:
1. Normal chat.
2. Code snippets. (To access, press `Ctrl + Shift + Enter` while on the chat box)
3. Upload images and/or files.
4. Emoji and GIFs