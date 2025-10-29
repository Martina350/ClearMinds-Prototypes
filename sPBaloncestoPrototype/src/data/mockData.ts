// Datos mock para desarrollo y pruebas
import { User, Deportista, Championship, Match, Payment, PaymentHistory, Team } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'padre1',
    password: '123456',
    role: 'parent',
    children: [
      {
        id: '1',
        name: 'Juan Pérez',
        parentId: '1',
        category: 'Sub-15',
        gender: 'masculino'
      }
    ]
  },
  {
    id: '2',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  }
];

export const mockDeportistas: Deportista[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    parentId: '1',
    category: 'Sub-15',
    gender: 'masculino'
  },
  {
    id: '2',
    name: 'María García',
    parentId: '1',
    category: 'Sub-13',
    gender: 'femenino'
  }
];

// Alias para compatibilidad
export const mockStudents = mockDeportistas;

export const mockChampionships: Championship[] = [
  // Sub-8
  {
    id: '1',
    name: 'Regional Sub-8 Masculino',
    category: 'Sub-8',
    gender: 'masculino',
    tournamentType: 'Regional',
    startDate: '2024-11-05',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '1',
        name: 'San Pedro',
        points: 6,
        wins: 2,
        losses: 0,
        pointsFor: 80,
        pointsAgainst: 40
      },
      {
        id: '2',
        name: 'Colegio Central',
        points: 3,
        wins: 1,
        losses: 1,
        pointsFor: 60,
        pointsAgainst: 50
      }
    ],
    matches: [
      {
        id: '1',
        championshipId: '1',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-11-20',
        time: '14:00',
        category: 'Sub-8',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '2',
    name: 'Regional Sub-8 Femenino',
    category: 'Sub-8',
    gender: 'femenino',
    tournamentType: 'Regional',
    startDate: '2024-11-06',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '3',
        name: 'San Pedro',
        points: 6,
        wins: 2,
        losses: 0,
        pointsFor: 70,
        pointsAgainst: 35
      }
    ],
    matches: [
      {
        id: '2',
        championshipId: '2',
        homeTeam: 'San Pedro',
        awayTeam: 'Instituto Norte',
        date: '2024-11-21',
        time: '14:30',
        category: 'Sub-8',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-9
  {
    id: '3',
    name: 'Regional Sub-9 Masculino',
    category: 'Sub-9',
    gender: 'masculino',
    tournamentType: 'Regional',
    startDate: '2024-11-07',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '4',
        name: 'San Pedro',
        points: 9,
        wins: 3,
        losses: 0,
        pointsFor: 120,
        pointsAgainst: 60
      },
      {
        id: '5',
        name: 'Santa María',
        points: 6,
        wins: 2,
        losses: 1,
        pointsFor: 100,
        pointsAgainst: 80
      }
    ],
    matches: [
      {
        id: '3',
        championshipId: '3',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-11-22',
        time: '15:00',
        category: 'Sub-9',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '4',
    name: 'Regional Sub-9 Femenino',
    category: 'Sub-9',
    gender: 'femenino',
    tournamentType: 'Regional',
    startDate: '2024-11-08',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '6',
        name: 'San Pedro',
        points: 9,
        wins: 3,
        losses: 0,
        pointsFor: 110,
        pointsAgainst: 55
      }
    ],
    matches: [
      {
        id: '4',
        championshipId: '4',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-11-23',
        time: '15:30',
        category: 'Sub-9',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-10
  {
    id: '5',
    name: 'Nacional Sub-10 Masculino',
    category: 'Sub-10',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-09',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '7',
        name: 'San Pedro',
        points: 12,
        wins: 4,
        losses: 0,
        pointsFor: 200,
        pointsAgainst: 100
      },
      {
        id: '8',
        name: 'Santa María',
        points: 9,
        wins: 3,
        losses: 1,
        pointsFor: 180,
        pointsAgainst: 120
      }
    ],
    matches: [
      {
        id: '5',
        championshipId: '5',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-11-24',
        time: '16:00',
        category: 'Sub-10',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '6',
    name: 'Nacional Sub-10 Femenino',
    category: 'Sub-10',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-10',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '9',
        name: 'San Pedro',
        points: 12,
        wins: 4,
        losses: 0,
        pointsFor: 190,
        pointsAgainst: 95
      }
    ],
    matches: [
      {
        id: '6',
        championshipId: '6',
        homeTeam: 'San Pedro',
        awayTeam: 'Instituto Norte',
        date: '2024-11-25',
        time: '16:30',
        category: 'Sub-10',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-11
  {
    id: '7',
    name: 'Nacional Sub-11 Masculino',
    category: 'Sub-11',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-11',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '10',
        name: 'San Pedro',
        points: 15,
        wins: 5,
        losses: 0,
        pointsFor: 250,
        pointsAgainst: 125
      },
      {
        id: '11',
        name: 'Colegio Central',
        points: 12,
        wins: 4,
        losses: 1,
        pointsFor: 220,
        pointsAgainst: 150
      }
    ],
    matches: [
      {
        id: '7',
        championshipId: '7',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-11-26',
        time: '17:00',
        category: 'Sub-11',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '8',
    name: 'Nacional Sub-11 Femenino',
    category: 'Sub-11',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-12',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '12',
        name: 'San Pedro',
        points: 15,
        wins: 5,
        losses: 0,
        pointsFor: 240,
        pointsAgainst: 120
      }
    ],
    matches: [
      {
        id: '8',
        championshipId: '8',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-11-27',
        time: '17:30',
        category: 'Sub-11',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-12
  {
    id: '9',
    name: 'Nacional Sub-12 Masculino',
    category: 'Sub-12',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-13',
    currentPhase: 'Semifinales',
    isActive: true,
    teams: [
      {
        id: '13',
        name: 'San Pedro',
        points: 18,
        wins: 6,
        losses: 0,
        pointsFor: 360,
        pointsAgainst: 180
      },
      {
        id: '14',
        name: 'Santa María',
        points: 15,
        wins: 5,
        losses: 1,
        pointsFor: 320,
        pointsAgainst: 200
      }
    ],
    matches: [
      {
        id: '9',
        championshipId: '9',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-11-28',
        time: '18:00',
        category: 'Sub-12',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '10',
    name: 'Nacional Sub-12 Femenino',
    category: 'Sub-12',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-14',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '15',
        name: 'San Pedro',
        points: 18,
        wins: 6,
        losses: 0,
        pointsFor: 340,
        pointsAgainst: 170
      }
    ],
    matches: [
      {
        id: '10',
        championshipId: '10',
        homeTeam: 'San Pedro',
        awayTeam: 'Instituto Norte',
        date: '2024-11-29',
        time: '18:30',
        category: 'Sub-12',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-13
  {
    id: '11',
    name: 'Nacional Sub-13 Masculino',
    category: 'Sub-13',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-15',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '16',
        name: 'San Pedro',
        points: 21,
        wins: 7,
        losses: 0,
        pointsFor: 420,
        pointsAgainst: 210
      },
      {
        id: '17',
        name: 'Colegio Central',
        points: 18,
        wins: 6,
        losses: 1,
        pointsFor: 380,
        pointsAgainst: 240
      }
    ],
    matches: [
      {
        id: '11',
        championshipId: '11',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-11-30',
        time: '19:00',
        category: 'Sub-13',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '12',
    name: 'Nacional Sub-13 Femenino',
    category: 'Sub-13',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-16',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '18',
        name: 'San Pedro',
        points: 21,
        wins: 7,
        losses: 0,
        pointsFor: 400,
        pointsAgainst: 200
      }
    ],
    matches: [
      {
        id: '12',
        championshipId: '12',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-12-01',
        time: '19:30',
        category: 'Sub-13',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-14
  {
    id: '13',
    name: 'Nacional Sub-14 Masculino',
    category: 'Sub-14',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-17',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '19',
        name: 'San Pedro',
        points: 24,
        wins: 8,
        losses: 0,
        pointsFor: 480,
        pointsAgainst: 240
      },
      {
        id: '20',
        name: 'Instituto Norte',
        points: 21,
        wins: 7,
        losses: 1,
        pointsFor: 440,
        pointsAgainst: 280
      }
    ],
    matches: [
      {
        id: '13',
        championshipId: '13',
        homeTeam: 'San Pedro',
        awayTeam: 'Instituto Norte',
        date: '2024-12-02',
        time: '20:00',
        category: 'Sub-14',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '14',
    name: 'Nacional Sub-14 Femenino',
    category: 'Sub-14',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-18',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '21',
        name: 'San Pedro',
        points: 24,
        wins: 8,
        losses: 0,
        pointsFor: 460,
        pointsAgainst: 230
      }
    ],
    matches: [
      {
        id: '14',
        championshipId: '14',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-12-03',
        time: '20:30',
        category: 'Sub-14',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-15
  {
    id: '15',
    name: 'Nacional Sub-15 Masculino',
    category: 'Sub-15',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-19',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '22',
        name: 'San Pedro',
        points: 27,
        wins: 9,
        losses: 0,
        pointsFor: 540,
        pointsAgainst: 270
      },
      {
        id: '23',
        name: 'Santa María',
        points: 24,
        wins: 8,
        losses: 1,
        pointsFor: 500,
        pointsAgainst: 320
      }
    ],
    matches: [
      {
        id: '15',
        championshipId: '15',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-12-04',
        time: '21:00',
        category: 'Sub-15',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '16',
    name: 'Nacional Sub-15 Femenino',
    category: 'Sub-15',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-20',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '24',
        name: 'San Pedro',
        points: 27,
        wins: 9,
        losses: 0,
        pointsFor: 520,
        pointsAgainst: 260
      }
    ],
    matches: [
      {
        id: '16',
        championshipId: '16',
        homeTeam: 'San Pedro',
        awayTeam: 'Instituto Norte',
        date: '2024-12-05',
        time: '21:30',
        category: 'Sub-15',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-16
  {
    id: '17',
    name: 'Nacional Sub-16 Masculino',
    category: 'Sub-16',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-21',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '25',
        name: 'San Pedro',
        points: 30,
        wins: 10,
        losses: 0,
        pointsFor: 600,
        pointsAgainst: 300
      },
      {
        id: '26',
        name: 'Colegio Central',
        points: 27,
        wins: 9,
        losses: 1,
        pointsFor: 560,
        pointsAgainst: 360
      }
    ],
    matches: [
      {
        id: '17',
        championshipId: '17',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-12-06',
        time: '22:00',
        category: 'Sub-16',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '18',
    name: 'Nacional Sub-16 Femenino',
    category: 'Sub-16',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-22',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '27',
        name: 'San Pedro',
        points: 30,
        wins: 10,
        losses: 0,
        pointsFor: 580,
        pointsAgainst: 290
      }
    ],
    matches: [
      {
        id: '18',
        championshipId: '18',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-12-07',
        time: '22:30',
        category: 'Sub-16',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  },
  // Sub-17
  {
    id: '19',
    name: 'Nacional Sub-17 Masculino',
    category: 'Sub-17',
    gender: 'masculino',
    tournamentType: 'Nacional',
    startDate: '2024-11-23',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '28',
        name: 'San Pedro',
        points: 33,
        wins: 11,
        losses: 0,
        pointsFor: 660,
        pointsAgainst: 330
      },
      {
        id: '29',
        name: 'Instituto Norte',
        points: 30,
        wins: 10,
        losses: 1,
        pointsFor: 620,
        pointsAgainst: 400
      }
    ],
    matches: [
      {
        id: '19',
        championshipId: '19',
        homeTeam: 'San Pedro',
        awayTeam: 'Instituto Norte',
        date: '2024-12-08',
        time: '23:00',
        category: 'Sub-17',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '20',
    name: 'Nacional Sub-17 Femenino',
    category: 'Sub-17',
    gender: 'femenino',
    tournamentType: 'Nacional',
    startDate: '2024-11-24',
    currentPhase: 'Fase de Clasificación',
    isActive: true,
    teams: [
      {
        id: '30',
        name: 'San Pedro',
        points: 33,
        wins: 11,
        losses: 0,
        pointsFor: 640,
        pointsAgainst: 320
      }
    ],
    matches: [
      {
        id: '20',
        championshipId: '20',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-12-09',
        time: '23:30',
        category: 'Sub-17',
        gender: 'femenino',
        status: 'scheduled'
      }
    ]
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    deportistaId: '1',
    description: 'Mensualidad Enero 2024',
    amount: 30,
    dueDate: '2024-01-05',
    status: 'paid',
    paymentMethod: 'card',
    paymentDate: '2024-01-03',
    createdAt: '2024-01-01',
    type: 'mensualidad',
    period: 'Enero 2024'
  },
  {
    id: '2',
    deportistaId: '1',
    description: 'Mensualidad Febrero 2024',
    amount: 30,
    dueDate: '2024-02-05',
    status: 'pending',
    createdAt: '2024-02-01',
    type: 'mensualidad',
    period: 'Febrero 2024'
  },
  {
    id: '3',
    deportistaId: '2',
    description: 'Mensualidad Enero 2024',
    amount: 30,
    dueDate: '2024-01-05',
    status: 'under_review',
    paymentMethod: 'transfer',
    receiptImage: 'receipt_maria_jan.jpg',
    createdAt: '2024-01-02',
    type: 'mensualidad',
    period: 'Enero 2024'
  },
  {
    id: '4',
    deportistaId: '1',
    description: 'Inscripción Torneo Nacional Sub-15',
    amount: 50,
    dueDate: '2024-03-15',
    status: 'pending',
    createdAt: '2024-03-01',
    type: 'inscripcion_torneo',
    tournamentId: '15'
  },
  {
    id: '5',
    deportistaId: '2',
    description: 'Inscripción Evento de Verano',
    amount: 25,
    dueDate: '2024-04-20',
    status: 'paid',
    paymentMethod: 'card',
    paymentDate: '2024-04-18',
    createdAt: '2024-04-01',
    type: 'inscripcion_evento',
    eventId: 'verano_2024'
  }
];

export const mockPaymentHistory: PaymentHistory[] = [
  {
    id: '1',
    deportistaId: '1',
    description: 'Mensualidad Diciembre 2023',
    amount: 30,
    status: 'paid',
    paymentMethod: 'card',
    paymentDate: '2023-12-28',
    createdAt: '2023-12-01',
    type: 'mensualidad',
    period: 'Diciembre 2023'
  },
  {
    id: '2',
    deportistaId: '1',
    description: 'Mensualidad Noviembre 2023',
    amount: 30,
    status: 'paid',
    paymentMethod: 'transfer',
    paymentDate: '2023-11-30',
    receiptImage: 'receipt_nov.jpg',
    createdAt: '2023-11-01',
    type: 'mensualidad',
    period: 'Noviembre 2023'
  }
];
