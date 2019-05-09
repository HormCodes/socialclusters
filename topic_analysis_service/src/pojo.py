platforms = [
    {'collection': 'tweet', 'id': 'twitter', 'sourcePath': ["author", "username"]},
    {'collection': 'news', 'id': 'news', 'sourcePath': ["publisher", "name"]},
    {'collection': 'facebook_posts', 'id': 'facebook', 'sourcePath': []},
    {'collection': 'reddit_posts', 'id': 'reddit', 'sourcePath': ["author"]},
]


class Config:
    def __init__(self, backendHost, contentDatabaseHost, userDatabaseHost):
        self.backendHost = backendHost
        self.contentDatabaseHost = contentDatabaseHost
        self.userDatabaseHost = userDatabaseHost
