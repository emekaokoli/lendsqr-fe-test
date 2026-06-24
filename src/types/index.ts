export interface Guarantor {
  fullName: string;
  phone: string;
  email: string;
  relationship: string;
}

export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';

export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phone: string;
  dateJoined: string;
  status: UserStatus;
  fullName: string;
  avatar: null;
  accountNumber: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
  levelOfEducation: string;
  employmentStatus: string;
  sectorOfEmployment: string;
  durationOfEmployment: string;
  officeEmail: string;
  monthlyIncome: string;
  loanRepayment: string;
  twitter: string;
  facebook: string;
  instagram: string;
  tier: number;
  accountBalance: string;
  bank: string;
  guarantors: Guarantor[];
}

export interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Stats {
  users: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
}

export interface UserFilters {
  organization?: string;
  username?: string;
  email?: string;
  phone?: string;
  status?: string;
  date?: string;
}
