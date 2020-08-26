# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:3.0-appservice
FROM mcr.microsoft.com/azure-functions/node:3.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    PLAYWRIGHT_BROWSERS_PATH=0

COPY . /home/site/wwwroot

RUN cd /home/site/wwwroot/form-automation && \
    npm install

RUN cd /home/site/wwwroot/cron-function && \
    npm install && \
    npm run build

RUN cp -r /home/site/wwwroot/cron-function/* /home/site/wwwroot/
RUN cp -r /home/site/wwwroot/form-automation /home/site