import path from 'path';
import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/prisma/generated/client';

const dbPath = path.join(__dirname, '..', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {

  // ── Joueurs ──────────────────────────────────────────────────────────────
  await prisma.joueur.upsert({ where: { nom: 'Alice' },   update: {}, create: { nom: 'Alice' } });
  await prisma.joueur.upsert({ where: { nom: 'Bob' },     update: {}, create: { nom: 'Bob' } });
  await prisma.joueur.upsert({ where: { nom: 'Charlie' }, update: {}, create: { nom: 'Charlie' } });

  // ── Succès ───────────────────────────────────────────────────────────────
  const s1 = await prisma.succes.upsert({
    where: { id: 1 },
    update: {},
    create: { libelle: 'Première victoire', description: 'Remporter sa toute première partie.' },
  });
  const s2 = await prisma.succes.upsert({
    where: { id: 2 },
    update: {},
    create: { libelle: 'Sans faute', description: 'Répondre correctement à toutes les questions d\'une partie.' },
  });
  await prisma.succes.upsert({
    where: { id: 3 },
    update: {},
    create: { libelle: 'Vétéran', description: 'Participer à 5 parties ou plus.' },
  });

  // ── Catégories ───────────────────────────────────────────────────────────
  const geo = await prisma.categorie.upsert({
    where: { id: 1 },
    update: {},
    create: { libelle: 'Géographie', description: 'Questions sur les pays, capitales et continents.' },
  });
  const science = await prisma.categorie.upsert({
    where: { id: 2 },
    update: {},
    create: { libelle: 'Sciences', description: 'Questions sur la physique, chimie et biologie.' },
  });

  // ── Questions ────────────────────────────────────────────────────────────
  const q1 = await prisma.question.upsert({
    where: { id: 1 },
    update: {},
    create: {
      interrogation: 'Quelle est la capitale de la France ?',
      reponse: 'Paris', proposition1: 'Lyon', proposition2: 'Marseille', proposition3: 'Bordeaux',
      id_categorie: geo.id,
    },
  });
  const q2 = await prisma.question.upsert({
    where: { id: 2 },
    update: {},
    create: {
      interrogation: 'Quel est le plus grand océan du monde ?',
      reponse: 'Pacifique', proposition1: 'Atlantique', proposition2: 'Indien', proposition3: 'Arctique',
      id_categorie: geo.id,
    },
  });
  const q3 = await prisma.question.upsert({
    where: { id: 3 },
    update: {},
    create: {
      interrogation: 'Quelle est la formule chimique de l\'eau ?',
      reponse: 'H2O', proposition1: 'CO2', proposition2: 'O2', proposition3: 'H2SO4',
      id_categorie: science.id,
    },
  });
  const q4 = await prisma.question.upsert({
    where: { id: 4 },
    update: {},
    create: {
      interrogation: 'Combien de chromosomes possède l\'être humain ?',
      reponse: '46', proposition1: '23', proposition2: '48', proposition3: '36',
      id_categorie: science.id,
    },
  });

  // ── Partie 1 : Géographie, Alice vs Bob, vainqueur Alice ─────────────────
  const partie1 = await prisma.partie.upsert({
    where: { id: 1 },
    update: {},
    create: { nb_questions: 2, id_categorie: geo.id, nom_vainqueur: 'Alice' },
  });
  await prisma.partieJoueur.upsert({ where: { nom_joueur_id_partie: { nom_joueur: 'Alice', id_partie: partie1.id } }, update: {}, create: { id_partie: partie1.id, nom_joueur: 'Alice', points: 2 } });
  await prisma.partieJoueur.upsert({ where: { nom_joueur_id_partie: { nom_joueur: 'Bob', id_partie: partie1.id } },   update: {}, create: { id_partie: partie1.id, nom_joueur: 'Bob',   points: 1 } });
  await prisma.partieQuestion.upsert({ where: { id_partie_id_question: { id_partie: partie1.id, id_question: q1.id } }, update: {}, create: { id_partie: partie1.id, id_question: q1.id, id_joueur: 'Alice', ordre: 1 } });
  await prisma.partieQuestion.upsert({ where: { id_partie_id_question: { id_partie: partie1.id, id_question: q2.id } }, update: {}, create: { id_partie: partie1.id, id_question: q2.id, id_joueur: 'Bob',   ordre: 2 } });

  // ── Partie 2 : Sciences, Bob vs Charlie, vainqueur Charlie ───────────────
  const partie2 = await prisma.partie.upsert({
    where: { id: 2 },
    update: {},
    create: { nb_questions: 2, id_categorie: science.id, nom_vainqueur: 'Charlie' },
  });
  await prisma.partieJoueur.upsert({ where: { nom_joueur_id_partie: { nom_joueur: 'Bob',     id_partie: partie2.id } }, update: {}, create: { id_partie: partie2.id, nom_joueur: 'Bob',     points: 0 } });
  await prisma.partieJoueur.upsert({ where: { nom_joueur_id_partie: { nom_joueur: 'Charlie', id_partie: partie2.id } }, update: {}, create: { id_partie: partie2.id, nom_joueur: 'Charlie', points: 2 } });
  await prisma.partieQuestion.upsert({ where: { id_partie_id_question: { id_partie: partie2.id, id_question: q3.id } }, update: {}, create: { id_partie: partie2.id, id_question: q3.id, id_joueur: 'Charlie', ordre: 1 } });
  await prisma.partieQuestion.upsert({ where: { id_partie_id_question: { id_partie: partie2.id, id_question: q4.id } }, update: {}, create: { id_partie: partie2.id, id_question: q4.id, id_joueur: 'Bob',     ordre: 2 } });

  // ── Partie 3 : Mixte, Alice vs Charlie, pas de vainqueur ─────────────────
  const partie3 = await prisma.partie.upsert({
    where: { id: 3 },
    update: {},
    create: { nb_questions: 2, id_categorie: null, nom_vainqueur: null },
  });
  await prisma.partieJoueur.upsert({ where: { nom_joueur_id_partie: { nom_joueur: 'Alice',   id_partie: partie3.id } }, update: {}, create: { id_partie: partie3.id, nom_joueur: 'Alice',   points: 1 } });
  await prisma.partieJoueur.upsert({ where: { nom_joueur_id_partie: { nom_joueur: 'Charlie', id_partie: partie3.id } }, update: {}, create: { id_partie: partie3.id, nom_joueur: 'Charlie', points: 1 } });
  await prisma.partieQuestion.upsert({ where: { id_partie_id_question: { id_partie: partie3.id, id_question: q1.id } }, update: {}, create: { id_partie: partie3.id, id_question: q1.id, id_joueur: 'Alice',   ordre: 1 } });
  await prisma.partieQuestion.upsert({ where: { id_partie_id_question: { id_partie: partie3.id, id_question: q3.id } }, update: {}, create: { id_partie: partie3.id, id_question: q3.id, id_joueur: 'Charlie', ordre: 2 } });

  // ── Succès débloqués ─────────────────────────────────────────────────────
  await prisma.joueurSucces.upsert({ where: { nom_joueur_id_succes: { nom_joueur: 'Alice',   id_succes: s1.id } }, update: {}, create: { nom_joueur: 'Alice',   id_succes: s1.id } });
  await prisma.joueurSucces.upsert({ where: { nom_joueur_id_succes: { nom_joueur: 'Charlie', id_succes: s1.id } }, update: {}, create: { nom_joueur: 'Charlie', id_succes: s1.id } });
  await prisma.joueurSucces.upsert({ where: { nom_joueur_id_succes: { nom_joueur: 'Alice',   id_succes: s2.id } }, update: {}, create: { nom_joueur: 'Alice',   id_succes: s2.id } });

  console.log('Seed terminé avec succès !');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });