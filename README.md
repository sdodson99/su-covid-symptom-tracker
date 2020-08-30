# Stevenson University Automated COVID Student Symptom Tracker

Automatically report your daily COVID symptom form to the Wellness Center. This automated script will submit the symptom tracker form
with the following values:

- Are you currently living on campus?: **No**
- In the last two weeks did you care for or have close contact with someone diagnosed with COVID-19?: **No**
- Do you have any of the following symptoms? (lists symptoms): **No**

More configuration may be added upon request. **Please be honest with your daily symptom report.**

## Installation

1. Install [Node](https://nodejs.org/en/download/).

2. Install [su-covid-daily-cli](https://www.npmjs.com/package/su-covid-daily-cli) globally with Node.

```
npm install -g su-covid-daily-cli
```

## Usage

- Submit symptoms.

```
sucovid submit
```

- Schedule repeating daily submission.

```
sucovid schedule
```

- Save credentials.

```
sucovid login
```

- Remove credentials.

```
sucovid logout
```

- View help.

```
sucovid help
```

## Disclaimer

Use this script at your own risk. **It is strongly recommended to view your receipt to ensure the form was accurately submitted.**
