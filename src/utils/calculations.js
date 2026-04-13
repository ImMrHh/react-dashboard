// Parse and normalize date to YYYY-MM-DD format
export const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
};

// Calculate all KPIs from data
export const calculateKPIs = (records) => {
  // Filtrar registros válidos (con Profesor y Status=Confirmed)
  const confirmedRecords = records.filter(
    (r) => r && r.Profesor && r.Status === 'Confirmed'
  );

  // Sesiones VR = ALL confirmed records (sin importar TipoSesion)
  const sesionesVR = confirmedRecords.length;

  // Clases Impartidas = Solo TipoSesion === 'Clase'
  const clasesImpartidas = confirmedRecords.filter(
    (r) => r.TipoSesion === 'Clase'
  ).length;

  // Profesores Activos = distinct professors en Clase (max 20)
  const profesoresSet = new Set();
  confirmedRecords.forEach((r) => {
    if (r.TipoSesion === 'Clase' && r.Profesor) {
      profesoresSet.add(r.Profesor);
    }
  });
  const profesoresActivos = Math.min(profesoresSet.size, 20);

  // Horas VR = Sesiones VR × 1 (cada sesión = 1 hora)
  const horasVR = sesionesVR * 1;

  // Instituciones Visitantes = distinct Grupo donde TipoSesion === 'Demo'
  const institucionesSet = new Set();
  confirmedRecords.forEach((r) => {
    if (r.TipoSesion === 'Demo' && r.Grupo && r.Grupo !== '-') {
      institucionesSet.add(r.Grupo);
    }
  });
  const institucionesVisitantes = institucionesSet.size;

  // Materias Participantes = distinct Materia en Clase sessions
  const materiasSet = new Set();
  confirmedRecords.forEach((r) => {
    if (r.TipoSesion === 'Clase' && r.Materia) {
      // Excluir 'Admin', 'R.V.', 'Demo'
      if (!['Admin', 'R.V.', 'Demo'].includes(r.Materia)) {
        materiasSet.add(r.Materia);
      }
    }
  });
  const materiasParticipantes = materiasSet.size;

  return {
    sesionesVR,
    clasesImpartidas,
    profesoresActivos,
    horasVR,
    institucionesVisitantes,
    materiasParticipantes,
  };
};

// Growth projections
export const calculateProjections = (baseKPIs, maxProfesores = 20) => {
  const ciclo2 = {
    sesionesVR: Math.floor(baseKPIs.sesionesVR * 1.5),
    clasesImpartidas: Math.floor(baseKPIs.clasesImpartidas * 1.5),
    profesoresActivos: Math.min(
      Math.floor(baseKPIs.profesoresActivos * 1.5),
      maxProfesores
    ),
    horasVR: Math.floor(baseKPIs.horasVR * 1.5),
  };

  const ciclo3 = {
    sesionesVR: Math.floor(ciclo2.sesionesVR * 1.5),
    clasesImpartidas: Math.floor(ciclo2.clasesImpartidas * 1.5),
    profesoresActivos: Math.min(
      Math.floor(ciclo2.profesoresActivos * 1.5),
      maxProfesores
    ),
    horasVR: Math.floor(ciclo2.horasVR * 1.5),
  };

  return { ciclo2, ciclo3 };
};

// Get monthly data for trends
export const getMonthlyTrends = (records) => {
  const monthMap = {};

  records.forEach((record) => {
    if (!record || record.Status !== 'Confirmed' || !record.Fecha) return;

    const fecha = normalizeDate(record.Fecha);
    if (!fecha) return;

    const [year, month] = fecha.substring(0, 7).split('-');
    const monthKey = `${year}-${month}`;

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        month: monthKey,
        sesiones: 0,
        clases: 0,
        demos: 0,
        planeacion: 0,
      };
    }

    monthMap[monthKey].sesiones += 1;
    if (record.TipoSesion === 'Clase') {
      monthMap[monthKey].clases += 1;
    } else if (record.TipoSesion === 'Demo') {
      monthMap[monthKey].demos += 1;
    } else if (record.TipoSesion === 'Planeación') {
      monthMap[monthKey].planeacion += 1;
    }
  });

  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
};

// Get teacher statistics
export const getTeacherStats = (records) => {
  const teacherMap = {};

  records.forEach((record) => {
    if (
      !record ||
      record.Status !== 'Confirmed' ||
      record.TipoSesion !== 'Clase' ||
      !record.Profesor
    )
      return;

    const profesor = record.Profesor;
    if (!teacherMap[profesor]) {
      teacherMap[profesor] = {
        nombre: profesor,
        sesiones: 0,
        materias: new Set(),
        grupos: new Set(),
      };
    }

    teacherMap[profesor].sesiones += 1;
    if (record.Materia) teacherMap[profesor].materias.add(record.Materia);
    if (record.Grupo && record.Grupo !== '-')
      teacherMap[profesor].grupos.add(record.Grupo);
  });

  return Object.values(teacherMap)
    .map((teacher) => ({
      ...teacher,
      materias: teacher.materias.size,
      grupos: teacher.grupos.size,
    }))
    .sort((a, b) => b.sesiones - a.sesiones);
};

// Get subject statistics (SOLO Clase, excluyendo Admin/R.V./Demo)
export const getSubjectStats = (records) => {
  const subjectMap = {};

  records.forEach((record) => {
    if (
      !record ||
      record.Status !== 'Confirmed' ||
      record.TipoSesion !== 'Clase' ||
      !record.Materia
    )
      return;

    // Excluir Admin, R.V., Demo - no son asignaturas reales
    if (['Admin', 'R.V.', 'Demo'].includes(record.Materia)) return;

    const materia = record.Materia;
    if (!subjectMap[materia]) {
      subjectMap[materia] = {
        nombre: materia,
        sesiones: 0,
        profesores: new Set(),
        grupos: new Set(),
      };
    }

    subjectMap[materia].sesiones += 1;
    if (record.Profesor) subjectMap[materia].profesores.add(record.Profesor);
    if (record.Grupo && record.Grupo !== '-')
      subjectMap[materia].grupos.add(record.Grupo);
  });

  return Object.values(subjectMap)
    .map((subject) => ({
      ...subject,
      profesores: subject.profesores.size,
      grupos: subject.grupos.size,
    }))
    .sort((a, b) => b.sesiones - a.sesiones);
};

// Get cancellation statistics
export const getCancellationStats = (records) => {
  const cancelados = records.filter((r) => r && r.Status === 'Cancelled');

  const monthMap = {};
  cancelados.forEach((record) => {
    const fecha = normalizeDate(record.Fecha);
    if (!fecha) return;

    const monthKey = fecha.substring(0, 7);
    monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
  });

  const monthly = Object.entries(monthMap)
    .map(([month, count]) => ({ month, cancelados: count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const totalConfirmed = records.filter((r) => r && r.Status === 'Confirmed')
    .length;
  const totalRecords = cancelados.length + totalConfirmed;

  return {
    totalCancelados: cancelados.length,
    tasaCancelacion:
      totalRecords > 0 ? ((cancelados.length / totalRecords) * 100).toFixed(1) : 0,
    monthly,
    detalles: cancelados,
  };
};

// Get planning session statistics
export const getPlanningStats = (records) => {
  const planeacion = records.filter(
    (r) => r && r.Status === 'Confirmed' && r.TipoSesion === 'Planeación'
  );

  const monthMap = {};
  planeacion.forEach((record) => {
    const fecha = normalizeDate(record.Fecha);
    if (!fecha) return;

    const monthKey = fecha.substring(0, 7);
    monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
  });

  const monthly = Object.entries(monthMap)
    .map(([month, count]) => ({ month, sesiones: count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalPlaneacion: planeacion.length,
    promedioPorMes:
      planeacion.length > 0
        ? (planeacion.length / (monthly.length || 1)).toFixed(1)
        : 0,
    monthly,
    detalles: planeacion,
  };
};

// Get visiting institutions statistics (SOLO Demo)
export const getVisitingInstitutionsStats = (records) => {
  const demos = records.filter(
    (r) => r && r.Status === 'Confirmed' && r.TipoSesion === 'Demo'
  );

  const institucionMap = {};
  demos.forEach((record) => {
    const institucion = record.Grupo;
    if (!institucion || institucion === '-') return;

    if (!institucionMap[institucion]) {
      institucionMap[institucion] = {
        nombre: institucion,
        sesiones: 0,
        materias: new Set(),
        fechas: [],
      };
    }

    institucionMap[institucion].sesiones += 1;
    if (record.Materia && !['Admin', 'R.V.', 'Demo'].includes(record.Materia)) {
      institucionMap[institucion].materias.add(record.Materia);
    }
    institucionMap[institucion].fechas.push(normalizeDate(record.Fecha));
  });

  return Object.values(institucionMap)
    .map((inst) => ({
      ...inst,
      materias: inst.materias.size,
      ultimaVisita: inst.fechas.sort().reverse()[0],
    }))
    .sort((a, b) => b.sesiones - a.sesiones);
};