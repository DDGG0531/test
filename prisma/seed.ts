// 這邊要做的就是 拿到orm 工具，用該工具塞資料，結束

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const auth1 = await prisma.auth.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      maxCreatorNum: 5,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '澤東',
      password: '123',
      authId: auth1.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: '近平',
      password: '64',
      authId: auth1.id,
    },
  });

  const creator1 = await prisma.creator.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '展展',
      url: '展展URL',
      imgUrl: '展展imgUrl',
      follower: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
      videos: {
        connectOrCreate: [
          {
            where: { id: 1 },
            create: {
              id: 1,
              title: '展展的第一支影片',
              url: '展展的第一支影片URL',
              imgUrl: '展展的第一支影片imgUrl',
            },
          },
          {
            where: { id: 2 },
            create: {
              id: 2,
              title: '展展的第二支影片',
              url: '展展的第二支影片URL',
              imgUrl: '展展的第二支影片imgUrl',
            },
          },
        ],
      },
    },
  });

  // 如果是關聯的話，要用videoId或是video 會變成optional，因為兩種寫法都可以
  const comment1 = await prisma.comment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      content: '展展的第一支影片的第一則留言',
      senderId: user1.id,
      videoId: 1,
      children: {
        connectOrCreate: [
          {
            where: { id: 2 },
            create: {
              id: 2,
              content: 'QWQ',
              senderId: user2.id,
              videoId: 1,
            },
          },
          {
            where: { id: 3 },
            create: {
              id: 3,
              content: 'QWQQQQQQ',
              senderId: user2.id,
              videoId: 1,
            },
          },
        ],
      },
      parentId: null,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
