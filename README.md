# ccb-slack

## Slack integration for Church Community Builder

**ccb-slack** makes it easy to access information from CCB directly from your Slack channels.

### Features

- Look up people's contact information
- Find recently added people
- Check attendance for an event
- Locate people on a map

### Install

```bash
git clone https://github.com/dbussert/ccb-slack.git
npm install
```

Set environment variables

- `PORT` the web server port (default 8000)
- `ccb_username` the API user
- `ccb_password` the API password
- `ccb_url` your CCB site
- `slack_token` your Slack integration token to ensure only your channels are making requests (only when NODE_ENV=production)
- `NODE_ENV` the node environment to enforce `slack_token` verification (default NOT production)

Create a `slash command` integration in Slack

- command `/ccb`
- url `public url of your ccb-slack server`
- method `GET` 

### Usage

#### /ccb whois `Name`

Get all matching people from CCB

'Name' can be any partial part of:

- `FirstName` `LastName`
- `FirstName`
- `LastName` (only if the 'LastName' does not match any 'FirstName')

#### /ccb people since `Date`

Get all people added to CCB since `Date`

`Date` can be the following:

- `last week`
- `yesterday`
- `two weeks ago`
- `X weeks ago`

#### /ccb attendance `Date`

Get attendance for an event since `Date`.  Currently only a single event `ccb_event_id` set in the environment variables.

`Date` can be the following:

- `2015-08-28`
- `since 2015-02-08`
- `last X weeks`

#### /ccb map everyone

Geolocate all individuals in CCB and return a KML of locations.  Note: this call cannot be done through Slack, as it does not return a message format Slack understands.  Instead it should be called directly in a web browser.

`http://localhost:8000/?command=ccb&text=map%20everyone`

Note: geolocating is purposely slow to not exceed Google's geocoding API limit (5 calls/sec).  Expect this call to take a long time even for a few hundred users.

### Formatting

#### Options

Responses from **ccb-slack** can be specially formatted if the defaults do not suffice, e.g. get people since last week as a CSV to paste into an email.  To format, append a JSON block to the end of the command:

`/ccb whois Smith {"delimiter":",", "break":",", "columns":["email"]}`

- `delimiter` the separator between each column of information for a person (default: ` - `
- `break` the separator between each person (default: `\n`)
- `columns` an array of columns of information for a person (default: varies per call)

#### Available columns

- name
- first_name
- last_name
- phone
- email
- created
- creator
- modified
- modifier
- address

### License

MIT. Copyright (c) Dillon Bussert.
