const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
import twilio from 'twilio';
const client = twilio(accountSid, authToken);
import cron from 'node-cron';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

export const sendSMS = async (to = '5563227495', body = 'Your appointment is coming up on July 21 at 3PM') => {
  try {
    const message = await client.messages.create({
      body,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+521${to}`,
    });

    return message;
  } catch (error) {
    console.error(error);
  }
};

export const sendSMS2BeforeHours = (citaPaciente) => {
  const fechaCita = dayjs(citaPaciente.Fecha, 'YYYY-MM-DD HH:mm:ss');

  cron.schedule(
    fechaCita.subtract(2, 'hour').format('m H D M d'),
    () => {
      //Enviar mensaje al doctor
      sendSMS(citaPaciente.DocPac.Doctor.Domicilio.Telefono, `Tiene una cita dentro de 2hrs con el paciente ${citaPaciente.DocPac.Paciente.Nombre} ${citaPaciente.DocPac.Paciente.ApellidoP} en la clinica ${citaPaciente.DocPac.Doctor.User.Clinica.Nombre}`);

      //Enviar mensaje al paciente
      sendSMS(citaPaciente.DocPac.Paciente.Domicilio.Telefono, `Tiene una cita dentro de 2hrs con el doctor ${citaPaciente.DocPac.Doctor.Nombre} ${citaPaciente.DocPac.Doctor.ApellidoP} en la clinica ${citaPaciente.DocPac.Doctor.User.Clinica.Nombre}`);
    }
  );
}

export const sendSMS24BeforeHours = (citaPaciente) => {
  const fechaCita = dayjs(citaPaciente.Fecha, 'YYYY-MM-DD HH:mm:ss');

  cron.schedule(
    fechaCita.subtract(24, 'hour').format('m H D M d'),
    () => {
      //Enviar mensaje al doctor
      sendSMS(citaPaciente.DocPac.Doctor.Domicilio.Telefono, `Tiene una cita mañana con el paciente ${citaPaciente.DocPac.Paciente.Nombre} ${citaPaciente.DocPac.Paciente.ApellidoP} en la clinica ${citaPaciente.DocPac.Doctor.User.Clinica.Nombre}`);

      //Enviar mensaje al paciente
      sendSMS(citaPaciente.DocPac.Paciente.Domicilio.Telefono, `Tiene una cita mañana con el doctor ${citaPaciente.DocPac.Doctor.Nombre} ${citaPaciente.DocPac.Doctor.ApellidoP} en la clinica ${citaPaciente.DocPac.Doctor.User.Clinica.Nombre}`);
    }
  );
}