import { hash, compare } from 'bcrypt';

export async function hashedConfirmation(id: string): Promise<string> {
  return await hash(id, 8);
}

export async function hashedPassword(password: string): Promise<string> {
  return await hash(password, 8);
}

export async function comparePassword(
  password: string,
  UserPassword: string,
): Promise<boolean> {
  return await compare(password, UserPassword);
}
