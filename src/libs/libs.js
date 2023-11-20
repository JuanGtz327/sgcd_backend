export function horaEnRango(hora, rangoInicio, rangoFin) {
  const horaDate = new Date();
  const [horaH, minutoH] = hora.split(':');
  horaDate.setHours(parseInt(horaH, 10), parseInt(minutoH, 10), 0);

  const rangoInicioDate = new Date();
  const [horaInicio, minutoInicio] = rangoInicio.split(':');
  rangoInicioDate.setHours(parseInt(horaInicio, 10), parseInt(minutoInicio, 10), 0);

  const rangoFinDate = new Date();
  const [horaFin, minutoFin] = rangoFin.split(':');
  rangoFinDate.setHours(parseInt(horaFin, 10), parseInt(minutoFin, 10), 0);

  return horaDate >= rangoInicioDate && horaDate <= rangoFinDate;
}

export function tieneDosHorasDeDiferencia(rangoInicio, rangoFin) {
  const rangoInicioDate = new Date();
  const [horaInicio, minutoInicio] = rangoInicio.split(':');
  rangoInicioDate.setHours(parseInt(horaInicio, 10), parseInt(minutoInicio, 10), 0);

  const rangoFinDate = new Date();
  const [horaFin, minutoFin] = rangoFin.split(':');
  rangoFinDate.setHours(parseInt(horaFin, 10), parseInt(minutoFin, 10), 0);

  const dosHorasEnMs = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
  const diferencia = rangoFinDate - rangoInicioDate;

  return diferencia >= dosHorasEnMs;
}