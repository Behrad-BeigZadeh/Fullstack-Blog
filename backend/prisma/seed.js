import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("⏳ Seeding database...");

  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all(
    ["behrad", "sara", "ali", "maryam"].map((name, i) =>
      prisma.user.create({
        data: {
          username: name,
          email: `${name}@example.com`,
          password: "password123",
        },
      })
    )
  );

  const postsData = [
    {
      title: "Modern Cityscape Views",
      content: "Capturing the modern urban skyline.",
      category: "LIFESTYLE",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843424/blog-posts/ydosfwrbkz5mlfaurpq2.jpg",
    },
    {
      title: "Creative UI Inspirations",
      content: "Fresh ideas for modern user interfaces.",
      category: "DESIGN",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843428/blog-posts/faiht2dzoxovdvaqo3hy.jpg",
    },
    {
      title: "Focus at Work",
      content: "Stay focused and productive in a busy environment.",
      category: "LIFESTYLE",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843430/blog-posts/inu3vixocmy6ifqi6tp0.jpg",
    },
    {
      title: "Coding Journey Begins",
      content: "Starting your path in the coding world.",
      category: "PROGRAMMING",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843431/blog-posts/nxjiapa8syoytkvjewdp.jpg",
    },
    {
      title: "JavaScript Deep Dive",
      content: "Advanced concepts and tricks in JavaScript.",
      category: "PROGRAMMING",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843432/blog-posts/oyxfrswurjqkit4e47tx.jpg",
    },
    {
      title: "AI Taking Over Industries",
      content: "How artificial intelligence is transforming businesses.",
      category: "TECH",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843434/blog-posts/iujazm2skc0m1akinopv.jpg",
    },
    {
      title: "Remote Work Essentials",
      content: "Setting up your ideal home office for success.",
      category: "LIFESTYLE",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843438/blog-posts/lqvjm8h8p0js9fwdewfg.jpg",
    },
    {
      title: "Mindfulness Techniques",
      content: "Staying calm and focused throughout your day.",
      category: "PERSONAL",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843441/blog-posts/wpdoleciraly5qmfgzth.jpg",
    },
    {
      title: "Mastering React Quickly",
      content: "Quick strategies to learn React.js.",
      category: "PROGRAMMING",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843458/blog-posts/dot19rtod9yleqligq2v.jpg",
    },
    {
      title: "Creative Web Design Trends",
      content: "The most popular web design styles in 2025.",
      category: "DESIGN",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843460/blog-posts/har96r8ulij0nhlou5zq.jpg",
    },
    {
      title: "Overcoming Debugging Nightmares",
      content: "Facing and solving the hardest bugs.",
      category: "PROGRAMMING",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843461/blog-posts/wbr9hl5etmlxjsieflj8.jpg",
    },
    {
      title: "Introduction to Cloud Technology",
      content: "Understanding the basics of cloud computing.",
      category: "TECH",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843462/blog-posts/py73shxtbv0k4e58jwla.jpg",
    },
    {
      title: "Boost Confidence through Speaking",
      content: "How public speaking enhances your personal skills.",
      category: "PERSONAL",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843464/blog-posts/jdfyspgns5wf8tj8wrwn.jpg",
    },
    {
      title: "Power of TypeScript",
      content: "Why every JavaScript developer should learn TypeScript.",
      category: "PROGRAMMING",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843465/blog-posts/jgt1f8gk3ntrsuvhpjhr.jpg",
    },
    {
      title: "Minimalism in Design",
      content: "The art of minimal design principles.",
      category: "DESIGN",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843469/blog-posts/hh622ybjtjtsnnrfjsbt.jpg",
    },
    {
      title: "Lessons from Startup Failures",
      content: "What failed startups can teach future entrepreneurs.",
      category: "PERSONAL",
      coverImage:
        "https://res.cloudinary.com/dc0quhvpm/image/upload/v1745843471/blog-posts/t0fmcyx7x0q2xjerisxm.jpg",
    },
  ];

  for (let i = 0; i < postsData.length; i++) {
    const post = await prisma.post.create({
      data: {
        title: postsData[i].title,
        content: postsData[i].content,
        category: postsData[i].category,
        coverImage: postsData[i].coverImage,
        slug: generateSlug(postsData[i].title),
        authorId: users[0].id,
      },
    });

    const numLikes = Math.max(0, 4 - i);

    for (let j = 0; j < numLikes && j < users.length; j++) {
      await prisma.reaction.create({
        data: {
          type: "LIKE",
          userId: users[j].id,
          postId: post.id,
        },
      });
    }

    await prisma.post.update({
      where: { id: post.id },
      data: {
        likeCount: numLikes,
      },
    });
  }

  console.log("✅ Database seeded with top liked posts!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
