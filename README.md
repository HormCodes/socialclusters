# SocialClusters
Web app for social media content aggregation and analysation (Bachelor thesis work)

Work in progress...

## Setup

### Docker

You have tu setup docker containers for Mongo and Postgres Databases... 
```$xslt
cd docker
docker-compose up -d
```

 mongoimport --host 0.0.0.0 --port 27017 --db content_database --collection tweet --file twitter.json

### Firebase 

First you have to install Firebase tools and log in:
```$xslt
npm install -g firebase-tools
firebase login
```


Then you have to initialize project: 
```$xslt
firebase init hosting
```

## Deploy

[//]: # "TODO - Add deploy info"
...

## License & Credits

Created by [Matěj Horák](https://horm.cz) as a bachelor thesis with supervision by [Ing. Radek Burget, Ph.D.](http://www.fit.vutbr.cz/~burgetr/index.php.cs) at BUT FIT and sources are under [BUT FIT Open Source License](https://github.com/Horm/socialclusters/blob/master/LICENSE).

Used third party sources:

- Stopwords list: [stopwords-iso](https://github.com/stopwords-iso/stopwords-iso)


