import { PrismaClient, Provider, Role } from '@prisma/client';
import { createHmac } from 'crypto';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

// Define a well-known ID for the anonymous user (Nil UUID)
const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

async function main() {
  // 1. Seed default tags (existing logic)
  try {
    await prisma.tag.createMany({
      data: [
        {
          id: '4452656d-9fa4-4bd0-ba38-70492e31d180',
          name: 'EMERGENCY_FUND'
        }
      ],
      skipDuplicates: true
    });
    console.log('Default tags seeded successfully.');
  } catch (error) {
    console.error('Error seeding default tags:', error);
  }

  // 2. Seed or update the anonymous user
  const securityToken = process.env.SECURITY_TOKEN;
  const accessTokenSalt = process.env.ACCESS_TOKEN_SALT;

  if (!securityToken) {
    console.error(
      'Error: SECURITY_TOKEN is not set in the environment variables. Please check your .env file.'
    );
    // process.exit(1); // Optionally exit, or let it fail at hashing
    return; // Stop further execution in main if critical env vars are missing
  }

  if (!accessTokenSalt) {
    console.error(
      'Error: ACCESS_TOKEN_SALT is not set in the environment variables. Please check your .env file.'
    );
    // process.exit(1);
    return; // Stop further execution
  }

  // Hash the security token
  const hmac = createHmac('sha512', accessTokenSalt);
  hmac.update(securityToken);
  const hashedAccessToken = hmac.digest('hex');

  console.log(
    `Upserting anonymous user (ID: ${ANONYMOUS_USER_ID}) with hashed access token...`
  );

  try {
    const user = await prisma.user.upsert({
      where: { id: ANONYMOUS_USER_ID },
      update: {
        accessToken: hashedAccessToken
      },
      create: {
        id: ANONYMOUS_USER_ID,
        accessToken: hashedAccessToken,
        provider: Provider.ANONYMOUS, // Explicitly set, though it's the default
        role: Role.USER // Explicitly set, though it's the default
        // If your User model requires other fields like email for creation, add them here.
        // For example: email: `anonymous@${ANONYMOUS_USER_ID}.local`
      }
    });
    console.log(
      `Anonymous user (ID: ${user.id}) seeded/updated successfully with the correct hashed access token.`
    );
  } catch (error) {
    console.error('Error upserting anonymous user:', error);
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error in main seeding function:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });
