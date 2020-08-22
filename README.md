# Stevenson University Automated COVID Student Symptom Tracker

Automatically report your daily COVID symptom form to the Wellness Center. This automated script is only
applicable for **commuters** with **no recent contact with COVID** and **no COVID symptoms**. More configuration
coming soon.

**Please be honest with your daily symptom report.**

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

4. Create a file named '.env' with the following configuration.

```
USERNAME=[your Stevenson University username]
PASSWORD=[your Stevenson University password]
```

5. Run the automated script.

```
npm run start
```

6. (Optional) Observe your receipt at 'dist/receipt.png'.
