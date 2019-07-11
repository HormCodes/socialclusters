# SocialClusters
Web app for social media content aggregation and analysation (Bachelor's thesis work)

## Tools

- Docker
- Node
- JDK 1.8
- Python 3.6

#### Recommended Tools

- Intellij IDEA
- Postman
- Google Chrome Dev Tools

## Project structure

- `.circleci` - CI/CD Configuration
- `backend` - Backend
- `docker` - Container Configuration
- `fronted` - Frontend
- `job_scheduler` - Job Configuration
- `nginx` - Request Proxy Configuration
- `platfrom_api_service` - Platform API Service
- `topic_analysis_sevice` - Topic Analysis Service

## Configuration

1. Edit file `platform_api_service/config.json` for adding your API keys.
2. In directory `topic_analysis_service/makjka` add dictionaries for word lemma converter called [Majka](https://nlp.fi.muni.cz/ma/) with format `x.lt` where `x` is ISO language code, e.g. `cs`
3. (For production deploy) In a file `nginx/conf.d` change domain `example.com` to your own. 

## Setup




### Production
Repository contains a production setup script `setup.sh` or you can execute these commands:
```$xslt
cd docker
docker-compose up -d

cd ../backend
./gradlew clean
./gradlew bootJar

docker build --no-cache -t socialclusters/backend .

cd ../topic_analysis_service
docker build --no-cache -t socialclusters/topic_analysis_service .


cd ../platform_api_service
docker build --no-cache -t socialclusters/platform_api_service .

cd ../frontend
docker build --no-cache -t socialclusters/frontend .

cd ../nginx
docker build --no-cache -t socialclusters/nginx .

cd ../docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d


```

### Development

You have tu setup docker containers for Mongo and Postgres Databases... 
```$xslt
cd docker
docker-compose up -d
```

#### Backend
```$xslt
cd backend
./gradlew build
```

 
 #### Frontend
 ```$xslt
 cd frontend
 npm install
 npm start
 # For backend execute setup.sh from root directory (after npm start)
 ```
 
 #### Internal Services
 Platform API Service and Topic Analysis Service has same setup:
 ```$xslt
 cd service_directory
 pip3 install -r requirements.txt
 python3 src/server.py
 ```


## License & Credits

Created by [Matěj Horák](https://horm.cz). This project was originally part of a bachelor's thesis with supervision by [Ing. Radek Burget, Ph.D.](http://www.fit.vutbr.cz/~burgetr/index.php.cs) Now, the project is independent and [this commit](https://github.com/Horm/socialclusters/commit/f4836dbf5fc352ee4a0956b0f29cd224a61bbb1b) is last one from bachelor's thesis. 

Project is under [MIT license](https://github.com/Horm/socialclusters/blob/master/LICENSE) 


