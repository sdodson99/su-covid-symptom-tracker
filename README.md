# Stevenson University Automated COVID Student Symptom Tracker

Automatically report your daily COVID symptom form to the Wellness Center. This automated script is only
applicable for **commuters** with **no recent contact with COVID** and **no COVID symptoms**. More configuration
coming soon.

## Tutorial

1. Clone the repository locally.

```
git clone https://github.com/sdodson99/su-covid-symptom-tracker.git
```

2. Open the project directory.

```
cd su-covid-symptom-tracker/src/form-automation
```

3. Install packages.

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

- Use this script at your own risk. **It is strongly recommended to view your receipt to ensure the form was accurately submitted**
- Please be honest with your daily symptom report
