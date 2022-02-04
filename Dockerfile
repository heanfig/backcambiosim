FROM node:14
RUN adduser node root

WORKDIR /home/node/app

ENV NODE_ENV development

# Copia el package.json a la raiz del proyecto
COPY package*.json ./

#RUN sudo chmod -R 777 /usr/src/app

# Instala las dependencias necesarias para correr el proyecto
RUN ["npm","install","global","@nestjs/cli"]
RUN ["npm", "install"]
#RUN sudo chmod -R 777 /usr/src/app

COPY . .

## Habilitar solo en entornos productivos
# RUN ["npm", "run", "build"]

RUN chmod -R 775 /home/node/app
RUN chown -R node:root /home/node/app

EXPOSE 3000

USER 1000

#RUN sudo chmod -R 777 /usr/src/app

## Comando para iniciar el servidor de desarrollo
ENTRYPOINT ["npm","run","start"]

#RUN sudo chmod -R 777 /usr/src/app

## Comando para iniciar el servidor de produccion
# ENTRYPOINT ["npm","run","start:prod"]