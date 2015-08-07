# ccb-slack
Slack integration for Church Community Builder.  

### Features

### Install

```bash
git clone https://github.com/dbussert/ccb-slack.git
npm install
```

Set environment variables

- `ccb_username` the API user
- `ccb_password` the API password
- `ccb_url` your CCB site
- `slack_token` your Slack token to ensure only your Slack can make requests

Create a `slash command` integration in Slack

- command `/ccb`
- url `public url of your ccb-slack server`
- method `GET` 

#### /ccb whois `Name`

Get all matching individuals from CCB

'Name' can be any partial part of:

- `FirstName` `LastName`
- `FirstName`
- `LastName` (only if the 'LastName' does not match any 'FirstName')

#### /ccb people since `Date`

Get all individuals added to CCB since `Date`

`Date` can be the following:

- `last week`
- `yesterday`
- `two weeks ago`
- `5 weeks ago`

#### /ccb attendance `Date`

Get attendance for an event since `Date`.  Currently only a single event `ccb_event_id` set in the environment variables.

`Date` can be the following:

- `2015-08-28`
- `since 2015-02-08`
- `last 3 weeks`

#### /ccb map everyone

Geolocate all individuals in CCB and return a KML of locations.  Note: this call cannot be done through Slack, as it does not return a message format Slack understands.  Instead it should be called directly in a web browser.

`http://localhost:8000/?command=ccb&text=map%20everyone`

Note: geolocating is purposely slowed to not exceed Google's geocoding API limit (5 calls/sec).
