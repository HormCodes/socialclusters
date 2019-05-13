from datetime import datetime

from dateutil.parser import parser


def get_iso_timestamp_from_string(timestamp_string):
    return parser().parse(timestamp_string).strftime("%Y-%m-%dT%H:%M:%SZ")


def get_iso_timestamp_from_unix_timestamp(unix_timestamp):
    return datetime.utcfromtimestamp((int(unix_timestamp))).strftime("%Y-%m-%dT%H:%M:%SZ")
