# SocialClusters
Web app for social media content aggregation and analysation (Bachelor's thesis work)

## Tools

- Docker
- Node
- JDK
- Python

#### Recommended Tools

- Intellij IDEA
- Postman
- Google Chrome Dev Tools

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

docker build -t socialclusters/backend .

cd ../topic_analysis_service
docker build -t socialclusters/topic_analysis_service .


cd ../platform_api_service
docker build -t socialclusters/platform_api_service .

cd ../frontend
docker build -t socialclusters/frontend .

cd ../nginx
docker build -t socialclusters/nginx .

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
 ```


## License & Credits

Created by [Matěj Horák](https://horm.cz) as a bachelor thesis with supervision by [Ing. Radek Burget, Ph.D.](http://www.fit.vutbr.cz/~burgetr/index.php.cs) at BUT FIT and sources are under [BUT FIT Open Source License](https://github.com/Horm/socialclusters/blob/master/LICENSE).


