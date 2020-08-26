# Stevenson University Automated COVID Student Symptom Tracker

Automatically report your daily COVID symptom form to the Wellness Center. This automated script will submit the symptom tracker form
with the following values:

- Are you currently living on campus?: **No**
- In the last two weeks did you care for or have close contact with someone diagnosed with COVID-19?: **No**
- Do you have any of the following symptoms? (lists symptoms): **No**

More configuration may be added upon request. **Please be honest with your daily symptom report.**

## Tutorial

1. Clone the [Git](https://git-scm.com/downloads) repository locally.

```
git clone https://github.com/sdodson99/su-covid-symptom-tracker.git
```

2. Open the project directory.

```
cd su-covid-symptom-tracker/src/cli
```

3. Install [Node](https://nodejs.org/en/download/) packages.

```
npm i
```

4. Create a file named '.env' with the following configuration. **This information is ONLY used to login to
   the Wellness Center portal.**

```
USERNAME=[your Stevenson University username]
PASSWORD=[your Stevenson University password]
```

5. Run the automated script.

```
npm run start
```

6. (Optional) Observe your receipt at 'dist/receipt.png'.

## Disclaimer

Use this script at your own risk. **It is strongly recommended to view your receipt to ensure the form was accurately submitted.**
