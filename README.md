

# EmotiScan

A project using Strolid vcon's to pin- point specific customer complaints, and a touch of SCITT to verify that the analysis does come from me.

Part of TADHack 2024. If you haven't watched the video, this will make very little sense!


# Notes

Random thoughts on the code:

## About cooked directory

This contains the resultant .attr (tags and attributes of the processed vcon) and .scitt files (the response from DataTrails)

The large vcon I demo in the video is labelled `0192a384-d567-8976-9dd8-dd37220d739c`


## About .env

API_DATA_TRAILS_BEARER_FILE: contains the whole bearer line. e.g.

```
Authorization: Bearer $TOKEN
```
API_DATA_TRAILS_BEARER_FILE: contains just the token string. e.g.

```
$TOKEN
```
