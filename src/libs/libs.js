import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

export function horaEnRangoDayJS(hora, rangoInicio, rangoFin) {
  const horaDate = dayjs().set('hour', hora.split(':')[0]).set('minute', hora.split(':')[1]).set('second', 0);
  const rangoInicioDate = dayjs().set('hour', rangoInicio.split(':')[0]).set('minute', rangoInicio.split(':')[1]).set('second', 0);
  const rangoFinDate = dayjs().set('hour', rangoFin.split(':')[0]).set('minute', rangoFin.split(':')[1]).set('second', 0);

  console.log(horaDate.format() , rangoInicioDate.format(), rangoFinDate.format());

  if(horaDate.isSame(rangoInicioDate) || horaDate.isAfter(rangoInicioDate)){
    if(horaDate.isSame(rangoFinDate) || horaDate.isBefore(rangoFinDate)){
      return true;
    }
  }

  return false;
}

export function tieneDosHorasDeDiferencia(hora1, hora2) {
  const formato = 'HH:mm';

  const fecha1 = dayjs(`2023-12-01 ${hora1}`, formato);
  const fecha2 = dayjs(`2023-12-01 ${hora2}`, formato);

  const difEnHoras = fecha2.diff(fecha1, 'hour');

  return Math.abs(difEnHoras) >= 2;
}