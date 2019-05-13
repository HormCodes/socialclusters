from unittest import TestCase

from timestamps import get_iso_timestamp_from_string, get_iso_timestamp_from_unix_timestamp


class TestTimestamps(TestCase):
    def test_get_iso_timestamp_from_string(self):
        self.assertEqual('2017-04-06T15:24:15Z', get_iso_timestamp_from_string("Thu Apr 06 15:24:15 +0000 2017"))

    def test_get_iso_timestamp_from_unix_timestamp(self):
        self.assertEqual('2017-04-06T15:24:15Z', get_iso_timestamp_from_unix_timestamp('1491492255'))
