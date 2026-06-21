import { prisma } from "../../lib/prisma"
import { IdentificationType, User, UserRole } from "@prisma/client"

export async function seed() {
  try {
  console.log('Seeding database...');
  const firstUserDetails= {
    first_name: 'John',
    middle_name: 'Doe',
    last_name: 'Doe',
    dob: new Date('1979-01-01'),
    email: 'vizionbnm@gmail.com',
    phone: '1234567890',
    nationality: 'American',
    id_no: '1234567890',
    license_exp_date: null,
    id_type: IdentificationType.PASSPORT,
    role: UserRole.MANAGEMENT,
  }
  
  const user = await prisma.user.upsert({
    where: { email: firstUserDetails.email },
    update: {},
    create: firstUserDetails,
  })
  
  console.log('User created:', user)
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

seed().then(() => {
  console.log('Seeding completed successfully');
}).catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
