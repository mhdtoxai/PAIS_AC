const userService = require('../../../services/userService');
const sendMessageTarget = require('../../../services/Wp-Envio-Msj/sendMessageTarget');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');
const LLM = require('../../../handlers/LLM/LLM');
const handleReset = require('../../../services/handleReset');


const handleAfilation = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    const respuesta = receivedMessage.toLowerCase();

    // ✅ Manejar botón "reset"
    if (respuesta === 'reset') {
        await handleReset(senderId);
        return;
    }

    if (respuesta !== 'si' && respuesta !== 'sí') {
        // 1️⃣ Ejecutar LLM por si el usuario hace una pregunta o comentario
        await LLM(senderId, receivedMessage);

        // 2️⃣ Luego, enviar mensaje aleatorio con botones para invitar de nuevo
        const retryMessages = [
            '😊 Nos encantaría que formes parte de la familia PAIS AC. 🤝 ¿Te gustaría conocer más sobre lo que hacemos? 🏡',
            '✨ ¡Unirte a PAIS AC puede ayudarte a crecer como profesional! ¿Quieres saber más? 📈',
            '🏠 ¿Te gustaría descubrir todos los beneficios de PAIS AC? Estamos para ayudarte. 🙌',
            '📈 Con PAIS AC puedes impulsar tu carrera y acceder a grandes oportunidades. ¿Te interesa saber cómo? 💼',
            '🎯 Ser parte de PAIS AC es dar un paso firme hacia tu crecimiento profesional. ¿Quieres más información? 🚀',
            '🔑 PAIS AC te conecta con una gran red de profesionales y nuevas oportunidades. ¿Te gustaría saber más? 🤝',
            '💬 ¡Estamos listos para resolver todas tus dudas sobre PAIS AC! ¿Te interesa conocer los beneficios? 🌟',
            '🌟 ¡Estás a un paso de formar parte de la red inmobiliaria más importante! ¿Te gustaría conocer cómo afiliarte? 🏘️'
        ];
        const randomMessage = retryMessages[Math.floor(Math.random() * retryMessages.length)];

        const buttons = [
            { id: 'si', title: 'Sí' },
            { id: 'reset', title: 'Volver a iniciar' }
        ];

        await sendMessageTarget(senderId, randomMessage, buttons);
        return;
    }

    // ✅ Usuario respondió "sí": avanzar con la información
    await userService.updateUser(senderId, { state: 'no_miembro_confirmacion' });
    console.log(`Estado actualizado a 'no_miembro_confirmacion'`);

    const info =
        '🏛️ *PAIS AC (Profesionales en Asesoría Inmobiliaria y Similares A.C.)* es una asociación inmobiliaria con 38 años de experiencia que aporta y capacita a los Asesores más profesionales y actualizados en el sector inmobiliario. 📈🇲🇽\n\n' +
        '✨ *¿Qué beneficios obtienes al afiliarte?*\n' +
        '🗓️ • Reuniones semanales (comercialización, capacitación, recorridos, etc.)\n' +
        '🤝 • Participación en eventos interasociaciones y macrocomercialización\n' +
        '🏡 • Publicación de propiedades en plataformas como Wiggot, Macrobolsa y Neojaus\n' +
        '💵 • Derecho a comisiones compartidas con asociaciones nacionales e internacionales\n' +
        '📲 • Apoyo en promoción, asesoría, grupos de WhatsApp especializados y respaldo ante controversias\n' +
        '🎓 • Acceso a descuentos en cursos y diplomados en temas inmobiliarios\n' +
        '🌐 • Micrositio, credencial digital, uso del logotipo PAIS y acceso a plataforma wechamber.com\n' +
        '🗣️ • Club de oratoria y herramienta de IA especializada en el sector\n\n' +
        '🤝 *Impulsamos tu empresa, fortalecemos tu presencia y representamos tus intereses ante autoridades.* 🏬✅';



    await sendMessage(senderId, info);

    const buttons = [
        { id: 'si', title: 'Sí' },
        { id: 'reset', title: 'Volver a iniciar' }
    ];
    const interested = '¿Te interesa afiliarte? 🤔 ¡Tenemos promociones especiales para nuevos miembros! 🎉😊';

    await sendMessageTarget(senderId, interested, buttons);
};

module.exports = handleAfilation;
