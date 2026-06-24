import { User, UserStatus } from '@/types';

const organizations: string[] = ['Lendsqr', 'Irorun', 'Lendstar', 'PayCo', 'FinEdge', 'CreditPlus'];
const statuses: UserStatus[] = ['Active', 'Inactive', 'Pending', 'Blacklisted'];
const firstNames: string[] = ['Grace', 'Tosin', 'Debby', 'Adedej', 'Emeka', 'Fatima', 'Chike', 'Ngozi', 'Bola', 'Tunde', 'Amaka', 'Yemi', 'Kola', 'Sade', 'Femi'];
const lastNames: string[] = ['Effiom', 'Dokunmu', 'Ogana', 'Adewale', 'Okafor', 'Bello', 'Abubakar', 'Nwosu', 'Adeleke', 'Ibrahim', 'Okonkwo', 'Lawal', 'Eze', 'Abdullahi', 'Obi'];
const domains: string[] = ['gmail.com', 'yahoo.com', 'lendsqr.com', 'outlook.com', 'hotmail.com'];
const sectors: string[] = ['FinTech', 'Banking', 'Insurance', 'Retail', 'Healthcare', 'Education'];
const residenceTypes: string[] = ["Parent's Apartment", 'Own Apartment', 'Rented Apartment', 'Company Quarters'];
const maritalStatuses: string[] = ['Single', 'Married', 'Divorced'];
const educationLevels: string[] = ['B.Sc', 'M.Sc', 'OND', 'HND', 'Ph.D', 'B.Tech'];
const employmentStatuses: string[] = ['Employed', 'Self-employed', 'Unemployed', 'Student'];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function generatePhone(): string {
  return `0${randInt(7, 9)}0${String(randInt(10000000, 99999999))}`;
}

function generateDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function generateUser(id: number): User {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const username = `${firstName.toLowerCase()}${id}`;
  const email = `${firstName.toLowerCase()}@${pick(domains)}`;
  const org = pick(organizations);
  const monthlyIncome = randInt(80000, 800000);

  return {
    id: `usr_${String(id).padStart(4, '0')}`,
    organization: org,
    username,
    email,
    phone: generatePhone(),
    dateJoined: generateDate(new Date(2019, 0, 1), new Date(2023, 11, 31)),
    status: pick(statuses),
    fullName,
    avatar: null,
    accountNumber: `${randInt(1000000000, 9999999999)}`,
    bvn: generatePhone(),
    gender: pick(['Male', 'Female']),
    maritalStatus: pick(maritalStatuses),
    children: pick(['None', '1', '2', '3']),
    typeOfResidence: pick(residenceTypes),
    levelOfEducation: pick(educationLevels),
    employmentStatus: pick(employmentStatuses),
    sectorOfEmployment: pick(sectors),
    durationOfEmployment: `${randInt(1, 10)} years`,
    officeEmail: `${firstName.toLowerCase()}@${org.toLowerCase().replace(' ', '')}.com`,
    monthlyIncome: `₦${monthlyIncome.toLocaleString()}.00 - ₦${(monthlyIncome + randInt(50000, 300000)).toLocaleString()}.00`,
    loanRepayment: String(randInt(10000, 100000)),
    twitter: `@${username}`,
    facebook: fullName,
    instagram: `@${username}_`,
    tier: randInt(1, 3),
    accountBalance: `₦${randInt(5000, 500000).toLocaleString()}.00`,
    bank: `${randInt(1000000000, 9999999999)} Providus Bank`,
    guarantors: [
      {
        fullName: `${pick(firstNames)} ${pick(lastNames)}`,
        phone: generatePhone(),
        email: `guarantor${id}@${pick(domains)}`,
        relationship: pick(['Sister', 'Brother', 'Friend', 'Colleague', 'Spouse']),
      },
      {
        fullName: `${pick(firstNames)} ${pick(lastNames)}`,
        phone: generatePhone(),
        email: `guarantor2${id}@${pick(domains)}`,
        relationship: pick(['Parent', 'Cousin', 'Neighbour']),
      },
    ],
  };
}

let _users: User[] | null = null;

export function getUsers(): User[] {
  if (!_users) {
    _users = Array.from({ length: 500 }, (_, i) => generateUser(i + 1));
  }
  return _users;
}

export function getUserById(id: string): User | null {
  return getUsers().find(u => u.id === id) || null;
}
