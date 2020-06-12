FROM node:12

LABEL maintainer="Wim Florijn <wim.florijn@kadaster.nl>"

WORKDIR /app

ADD VERSION .

COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["run"]
