import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";

// Inicializa Firebase Admin
admin.initializeApp();

// Función HTTP para enviar una notificación al iniciar la app
export const sendNotificationOnStart = functions.https.onRequest(
  async (req, res) => {
    // Configura el mensaje que se enviará como notificación
    const message = {
      notification: {
        title: "Bienvenido a la app",
        body: "La aplicación ha comenzado correctamente.",
      },
      topic: "players", // Puedes suscribir a dispositivos a este tema
    };

    // Enviar la notificación
    try {
      await admin.messaging().send(message);
      console.log("Notificación enviada");
      res.status(200).send("Notificación enviada correctamente");
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
      res.status(500).send("Error al enviar la notificación");
    }
  }
);

// Trigger para cuando un documento es actualizado en una colección específica
exports.sendNotificationOnUpdate = functions.firestore
  .document("players/{docId}")
  .onUpdate(async (change) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Solo enviar la notificación si hay un cambio relevante
    if (beforeData.algo !== afterData.algo) {
      const message = {
        notification: {
          title: "Actualización en la base de datos",
          body: "Se ha realizado un cambio en un documento.",
        },
        topic: "players",
      };

      try {
        await admin.messaging().send(message);
        console.log("Notificación enviada por cambio en Firestore");
      } catch (error) {
        console.error("Error al enviar la notificación Update:", error);
      }
    } else {
      const message = {
        notification: {
          title: "Actualización en la base de datos",
          body: "Se ha realizado un cambio en un documento.",
        },
        topic: "players",
      };

      try {
        await admin.messaging().send(message);
        console.log("Notificación enviada por cambio en Firestore");
      } catch (error) {
        console.error("Error al enviar la notificación Update:", error);
      }
    }
    return null;
  });

// Trigger para cuando un documento es creado en la colección 'players'
exports.sendNotificationOnCreate = functions.firestore
  .document("players/{docId}")
  .onCreate(async (snap) => {
    const newData = snap.data(); // Datos del nuevo jugador

    const message = {
      notification: {
        title: "Nuevo jugador agregado",
        body: `Se ha creado un nuevo jugador: ${newData?.name}`,
      },
      topic: "players", // Tema al que los dispositivos pueden estar suscritos
    };

    try {
      // Enviar la notificación
      await admin.messaging().send(message);
      console.log("Notificación enviada por creación de jugador");
    } catch (error) {
      console.error("Error al enviar la notificación por creación:", error);
    }

    return null;
  });
