import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('123', 10);

  const gestor = await prisma.usuario.upsert({
    where: { email: 'gestor@taskflow.com' },
    update: {},
    create: {
      nome: 'Felipe Admin',
      email: 'gestor@taskflow.com',
      senhaHash,
      role: Role.GESTOR,
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'manu@taskflow.com' },
    update: {},
    create: {
      nome: 'Manu',
      email: 'manu@taskflow.com',
      senhaHash,
      role: Role.FUNCIONARIO,
    },
  });

  const manu = await prisma.usuario.findUniqueOrThrow({
    where: { email: 'manu@taskflow.com' },
  });

  const existente = await prisma.demanda.count();
  if (existente === 0) {
    await prisma.demanda.create({
      data: {
        titulo: 'Revisar documentação do cliente',
        descricao: 'Conferir anexos e enviar feedback até o prazo.',
        prioridade: 'MEDIA',
        status: 'PENDENTE',
        prazo: new Date(Date.UTC(2026, 5, 15, 12, 0, 0)),
        responsavelId: manu.id,
        criadoPorId: gestor.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
