FROM mcr.microsoft.com/azure-functions/node:3.0-appservice

ENV AzureWebJobsScriptRoot=/home/site/wwwroot/cron-function \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    PLAYWRIGHT_BROWSERS_PATH=0

COPY . /home/site/wwwroot

RUN cd /home/site/wwwroot/form-automation && \
    npm install

RUN cd /home/site/wwwroot/cron-function && \
    npm install && \
    npm run build