FROM node:10.13.0

RUN useradd --user-group --create-home --shell /bin/false app &&\
  mkdir -p /home/app/app/node_modules && chown -R app:app /home/app/app

ENV HOME=/home/app
USER app

COPY --chown=app:app package.json $HOME/app
WORKDIR $HOME/app
RUN npm install -q

CMD ["node", "index.js"]

COPY --chown=app:app . $HOME/app
