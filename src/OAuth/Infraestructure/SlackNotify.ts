/* eslint-disable no-console */
const { IncomingWebhook } = require('@slack/client');

const name = 'Authentication app';
const channel = '#general';
const errorsChannel = '@Pedro';
const emoji = ':squirrel:';
const url = 'https://hooks.slack.com/services/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';
const webhook = new IncomingWebhook(url);

const notifyAlert = async (_message, to) => {
  // Notificaciones
  const message = typeof _message === 'string' ? _message : JSON.stringify(_message);

  if (process.env.NODE_ENV !== 'production' || !url) {
    console.log(`${to || channel}: ${message}`);
    //return true;
  }

  try {
    /*const res = await webhook.send({
      username: name,
      icon_emoji: emoji,
      channel: to ? to : channel,
      text: message,
    });*/
    const res = await webhook.send({
      username: name,
      icon_emoji: emoji,
      channel: to ? to : channel,
      text: message,
      attachments: [
        {
          fallback:
            'Nueva tarea abierta [Urgente]: <http://google.com | Prueba los adjuntos de mensajes de Slack>',
          pretext:
            'Nueva tarea abierta [Urgente]: <http://google.com | Prueba los adjuntos de mensajes de Slack>',
          color: '#D00000',
          fields: [
            {
              title: 'Notas',
              value: 'Esto es mucho más fácil de lo que pensaba.',
              short: false,
            },
          ],
        },
        {
          fallback:
            'Nueva tarea abierta [Urgente]: <http://google.com | Prueba los adjuntos de mensajes de Slack>',
          pretext:
            'Nueva tarea abierta [Urgente]: <http://google.com | Prueba los adjuntos de mensajes de Slack>',
          color: 'good',
          fields: [
            {
              title: 'Notas',
              value: 'asdfearfwefejh jkhf jkv hdgfjvg jdgvjd.',
              short: false,
            },
          ],
        },
      ],
    });
    return res.text === 'ok';
  } catch (e) {
    console.log('Error in NotificationSystem:', e.message);
    return false;
  }
};

const notifyPrivate = message => notifyAlert(message, errorsChannel);

notifyAlert('~Pedro~ *esto* _es_ una prueba de concepto muy chula\n ```codigo```', '');
notifyAlert('Pedro esto es una prueba de concepto muy chula', '@evalverde');
notifyPrivate('Pedro esto es una prueba de concepto muy chula');
