FROM node:10

LABEL maintainer "Wim Florijn <wim.florijn@kadaster.nl>"

WORKDIR /app

COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7070

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["run"]
